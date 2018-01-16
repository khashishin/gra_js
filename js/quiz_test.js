var quiz = [{
  "question": "Co robisz?",
  "choices": ["Idź na całość", "Podziel się"]
}]

function $(id) { // shortcut for document.getElementById
  return document.getElementById(id);
}

function hide(id) {
id.style.display="none";
}

function unhide(id) {
id.style.display="initial";
}

function wait(time, element){
	setTimeout(function(){
				hide(element);
				}, time);
}

// define elements
var content = $("content"),
  container=$("container"),
  questionContainer = $("question"),
  choicesContainer = $("choices"),
  scoreContainer = $("score"),
  submitBtn = $("submit"),
  introduction = $("wstep"),
  preambula = $("preambula"),
  rules_chckbox = $("rules"),
  rules_reminder= $("rules_confirmation_text"),
  user_reminder= $("user_confirmation_text"),
  rules_div= $("rules_confirmation"),
  bot_window = $("bot_window"),
  bot_avatar = $("bot_avatar"),
  bot_name=$("bot_name"),
  user_name_field= $("username"),
  game_text=$("game_text"),
  loading_page=$("loading_page"),
  rules=$("quick_rules"),
  zasady=$("wstep"),
  results_text=$("results_text");



// init vars
var currentQuestion = 0,
  rounds_with_bot=6,
  max_rounds=rounds_with_bot*4,
  current_bot_question=0,
  current_round=1;
  start_time=Math.floor(Date.now() / 1000)
  end_time=0
  data=[],
  questions=4,
  score = 0,
  metryka_form = document.forms['questionnaire'],
  czy_w_zwiazku = metryka_form.elements['czy_w_zwiazku'].value,
  plec = metryka_form.elements['plec'].value,
  wiek = metryka_form.elements['wiek'].value,
  wyksztalcenie = metryka_form.elements['wyksztalcenie'].value,
  malzenstwo = metryka_form.elements['czy_malzenstwo'].value,
  staz = metryka_form.elements['staz'].value,
  bot_score=0,
  started = false,
  botlist = ["koop","niekoop","wet koop","wet niekoop"],
  static_botlist = ["koop","niekoop","wet koop","wet niekoop"],
  game_botlist= [],
  round_cooperation_counter=0,
  cooperation_list=[],
  random_bot_choice = Math.floor(Math.random() * botlist.length),
  current_bot=botlist[random_bot_choice],
  confirmation_string = "Musisz potwiedzić że zapoznałeś/aś się z regulaminem i wypełnić ankietę demograficzną by wziąć udział w badaniu",
  user_confirmation_string= "Musisz wybrać sobie dowolną nazwę użytkownika by móc zagrać",
  user_name="",
  choicesHtml="";
  nick_list=["Jacek","Asia","Banan","Czesio","Paula","Wujko","Gralem_wczoraj","MarekW", "Józ", "Olla", "Prof_R", "Kuzyn", "Janek", "Michał", "Karyna", "Kasia", "Elzbietta"];
  bots_names_randomed=[];
  hide(loading_page);
  hide(results_text)
  
document.onload = start()

function start(){
options_list=quiz[0].choices;
bot_avatar.src ="test "+current_bot+".png";
hide(bot_window);
hide(container);
hide(rules);
submitBtn.addEventListener("click", show_rules, false);
}

function show_rules(){
	var metryka_checked =check_metryka()
	if (rules_chckbox.checked==true &&metryka_checked==true ){
			//
			hide(preambula)
			unhide(container)
			submitBtn.removeEventListener("click",show_rules)
			submitBtn.innerHTML="Gotów"
			submitBtn.addEventListener("click", submit_clicked)
		}
	else { rules_reminder.innerHTML =(confirmation_string);	}	
}

function check_metryka(){
  czy_w_zwiazku = metryka_form.elements['czy_w_zwiazku'].value,
  plec = metryka_form.elements['plec'].value,
  wiek = metryka_form.elements['wiek'].value,
  wyksztalcenie = metryka_form.elements['wyksztalcenie'].value,
  malzenstwo = metryka_form.elements['czy_malzenstwo'].value,
  staz = metryka_form.elements['staz'].value;

  if (czy_w_zwiazku !="" && malzenstwo!="" && plec!="" && wiek !="") {
		if (czy_w_zwiazku=="zwiazek_tak" && staz !="") {return true;}
		else if (czy_w_zwiazku=="zwiazek_nie") {return true;}
		else {return false;}
	}
  else {
  	return false;}
}

function askQuestion() {
  // setup for the first time
  if (currentQuestion === 1) {
		submitBtn.textContent = "Wybierz";
		//Hide rules
		hide(introduction);
		hide(rules_chckbox);
		hide(zasady)
		loading_page.innerHTML="Szukanie Gracza."
		unhide(loading_page);
		//false loading page
		wait(2800, loading_page);
		unhide(results_text)
		unhide(bot_window);
		unhide(bot_avatar);		
	}	
  update_score()
  
  //Load the question, we got only one so quiz[0]
  var question = quiz[0],
	choices = question.choices,
	choicesHtml = "";

  // loop through choices of given questio, and create radio buttons
  for (var i = 0; i < choices.length; i++) {
		choicesHtml += "<input type='radio' name='quiz" + currentQuestion +
		  "' id='choice" + (i + 1) +
		  "' value='" + choices[i] + "'>" +
		  " <label for='choice" + (i + 1) + "'>" + choices[i] + "</label><br>";
	}

  // load the question
  questionContainer.textContent =(current_bot_question) + ". " +
    question.question;
  // load the choices
  choicesContainer.innerHTML = choicesHtml;

}  

  
//What if submit button was clicked
function submit_clicked(){
	if (started== false) {
		if (user_name_field.value != "" ){
				user_name=user_name_field.value
				started=true
				currentQuestion=1
				current_bot_question=1
				hide(preambula)
				hide(rules_div)
				unhide(quick_rules)
				get_bot()
				game_text.innerHTML="Gracz: "+user_name
				askQuestion();}
		else { user_reminder.innerHTML =(user_confirmation_string);	}
		}
	
//If we started already
	else {
		var has_answer=false,
		choices_input= choicesContainer.getElementsByTagName("input");
		
		for (var i = 0; i < choices_input.length; i++) 
			{if (choices_input[i].checked==true) {var checked_option=i; has_answer=true}}
			
		if (has_answer==true) {
				var time_multiplier=1700;
				var bot_answer = get_bot_answer()
				var random = Math.random()
				var round_text="Ty wybrałeś '"+options_list[checked_option]+"'. Przeciwnik wybrał '"+options_list[bot_answer]+"'"
				if (random >0.5) 
					{
						loading_page.innerHTML="Czekanie na wybór gracza"; 
						unhide(loading_page); 
						wait(random*time_multiplier,loading_page)
						setTimeout(function(){ alert(round_text); }, time_multiplier*random*0.9);
						//alert("Ty wybrałeś '"+options_list[checked_option]+"'. Przeciwnik wybrał '"+options_list[bot_answer]+"'")						
					}
				else{
					alert(round_text)
				}
				results_text.value+=round_text+"\n"
				if (checked_option ==1) {
					round_cooperation_counter+=1
				}

				data.push([currentQuestion,checked_option,bot_answer,current_bot])
				calculate_cash(checked_option,bot_answer)
				currentQuestion+=1
				current_bot_question+=1;
										
			//End Game	
				if ((currentQuestion-1) >= max_rounds) {
				game_botlist.push(current_bot)
				end_time = Math.floor(Date.now() / 1000)
				cooperation_list.push(round_cooperation_counter);								
				if (score>bot_score) {var text="Udało ci się wygrać rundę."}				
				else {var text="Niestety przegrałeś/aś"}								
				setTimeout(function(){alert(text+" Twój wynik to: "+score+". Twój oponent natomiast uzyskał "+bot_score+". Prosimy o wypełnienie krótkiej ankiety podsumowującej grę.\n");								
				;}, random*time_multiplier);
				setTimeout(function(){show_bot_form();}, random*time_multiplier*1.1);
				}
				
			//Change bot after 6
				else if ((currentQuestion-1)%rounds_with_bot == 0 && (currentQuestion-1) < max_rounds){
					if (random > 0.5){
						setTimeout(function(){ load_next_round(); }, random*time_multiplier);
					}
					else {setTimeout(function(){ load_next_round(); }, 200)}
				}
			//Next question	
				else {askQuestion()}
			}	
		}	  
}


function update_score(){
scoreContainer.textContent = "Wygrana: " + score+ " " + "Wynik Przeciwnika: " + bot_score + ".";
game_text.innerHTML="Gracz: "+user_name + "<br> Runda " + current_round +" / 4" ;
}

//Score Calculation
function calculate_cash(checked_option, bot_answer) {
 if (checked_option==1 && bot_answer ==1) { bot_score+=25 ; score+=25}
 else if (checked_option==1 && bot_answer ==0) { bot_score+=500; score-=500}
 else if (checked_option==0 && bot_answer ==0) { bot_score-=250; score-=250}
 else if (checked_option==0 && bot_answer ==1) { bot_score-=500 ; score+=500}
}

//After ending round
function load_next_round(){
	if (score>bot_score) {var text="Udało ci się wygrać rundę."}
	else {var text="Niestety przegrałeś/aś"}
	cooperation_list.push(round_cooperation_counter)
	round_cooperation_counter=0
	
//Check if player continues
	if (confirm(text+"Twój wynik to: "+score+". Twój oponent natomiast uzyskał "+bot_score+". Następną rundę rozegrasz z kolejnym graczem.  Zasady gry pozostają takie same. Czy możemy rozpocząć grę? \nGuzik „anuluj” oznacza rezygnację z gry."))
		{loading_page.innerHTML="Szukanie Gracza"
			unhide(loading_page)
		wait(2500,loading_page);
		change_bot()
		askQuestion()}
	else {showResults();}
}



//Questionnaire creation
function show_bot_form(){
	hide(content)
	
	// Stwórz formularz
	var frame = document.createElement("form");
	frame.setAttribute('method',"post");
	frame.setAttribute('action',"post_1.php");

	create_hidden_input(frame, 'plec', plec)
	create_hidden_input(frame, 'wiek', wiek)
	create_hidden_input(frame, 'wyksztalcenie', wyksztalcenie)
	create_hidden_input(frame, 'czy_w_zwiazku', czy_w_zwiazku)
	create_hidden_input(frame, 'czy_malzenstwo', malzenstwo)
	create_hidden_input(frame, 'staz', staz)
	create_hidden_input(frame, 'nick', user_name)
	create_hidden_input(frame, 'time_spent', end_time-start_time)
//Number of cooperations
	for (var bot_played=0; bot_played < cooperation_list.length; bot_played++) {
		create_hidden_input(frame, 'coop_'+(bot_played+1), cooperation_list[bot_played])
	}
//Bot order
	for (var bot_played=0; bot_played < game_botlist.length; bot_played++) {
		create_hidden_input(frame, "bot_"+(bot_played+1), game_botlist[bot_played])
	}

	var bot_questionnaire = document.createElement("div")
	bot_questionnaire.className="bot_questions"
	add_bot_questions(bot_questionnaire);
	frame.appendChild(bot_questionnaire)
	
	var introd_paragraph = document.createElement("p");
	introd_paragraph.className="questionnaire";
	introd_paragraph.innerHTML= "<b><u>Instrukcja:</b></u><br>"+
	"Poniżej znajdują się stwierdzenia, które dotyczą zachowań w Pani/Pana związku w którym Pani/Pan pozostaje lub zakończył(a) go Pani/Pan w ciągu ostatniego miesiąca Proszę odnieść się do nich z perspektywy Pani/Pana."+
	"Do każdej pozycji dołączone jest skala perspektywa Pani/Pana. Proszę zaznaczyć liczbę na osi, która określa stopień zgodności z danym twierdzeniem, gdzie: "+
	"<ul> <li>	1 oznacza „To twierdzenie nie opisuje naszego związku” "+
	"<li>	5 oznacza „To twierdzenie dobrze opisuje nasz związek” </ul>"+
	"Nie ma tutaj dobrych ani złych odpowiedzi, dlatego proszę nie zastanawiać się zbyt długo oraz odpowiadać szczerze."+
	"Ankieta jest anonimowa. Dane tutaj zebrane posłużą mi do celów naukowych – upowszechniane będą jedynie w formie zbiorczych wyników. Nie jest to więc diagnoza funkcjonowania poszczególnych związków. <br>"+
	"Dziękuję za udział w badaniu!";
	
	frame.appendChild(introd_paragraph);	

	// Stwórz pytania
	var questionnaire_questions=
	["Podczas rozmów ze znajomymi często używam sformułowań w liczbie mnogiej odnośnie działań podejmowanych przeze mnie i partnera (np. pojedziemy).",
	 "Mój partner/partnerka nie dzieli się ze mną swoimi uczuciami.",
	 "Gdy zaistnieje konflikt, rozwiązujemy go wspólnymi siłami – razem z moją partnerką/partnerem.",
	 "Wiem, że mój parter/moja partnerka zawsze mnie wysłucha.",
	 "Pomimo różnic osobowości, potrafimy znaleźć coś, co nas łączy.",
	 "Cieszę się, gdy mój parter/partnerka realizuje z powodzeniem wyznaczone przez siebie zadania.",
	 "Każde nowe wspólne doświadczenie wzbogaca nasz związek.",
	 "Wiem, że mogę szczerze powiedzieć mojemu partnerowi/partnerce o tym, czego nie chcę lub nie potrafię zrobić.",
	 "Wspieram mojego partnera/partnerkę w podejmowaniu przez niego różnych ról społecznych.",
	 "Pomagam mojej partnerce/mojemu partnerowi przy zadaniach, z którymi sobie nie radzi.",
	 "Mój parter wspiera mnie w podejmowaniu ważnych dla mnie decyzji.",
	 "Czuję się szczęśliwa(y), gdy jestem razem z moim partnerem/partnerką.",
	 "W wielu sytuacjach potrafimy porozumiewać się bez słów.",
	 "Mój partner/partnerka jest dla mnie przyjacielem/przyjaciółką.",
	 "Mój partner/partnerka nie dzieli się ze mną swoimi wątpliwościami odnośnie naszego związku."
	 ];
	 
	for (var z = 0; z < questionnaire_questions.length; z++) {
			create_scale_for_question(z+1, questionnaire_questions[z],frame,5,"dobrze opisuje nasz zwiąek","nie opisuje naszego związku")
		}
		
	var questionnaire_confirm_btn = document.createElement("input");
	questionnaire_confirm_btn.type="button"
	questionnaire_confirm_btn.innerHTML="Wyślij formularz";
	questionnaire_confirm_btn.value="Wyślij formularz";
	questionnaire_confirm_btn.addEventListener('click', function(){
		submit_form(frame);
		});
	frame.appendChild(questionnaire_confirm_btn);
	container.appendChild(frame)

}

function create_hidden_input(form_element, name, value){
	var questionnaire_hidden_input = document.createElement("input");
	questionnaire_hidden_input.setAttribute("type", "hidden");
	questionnaire_hidden_input.setAttribute("name", name);
	questionnaire_hidden_input.setAttribute("value", value);
	form_element.appendChild(questionnaire_hidden_input)
}

function add_bot_questions(form_element){
	bot_introd_paragraph = document.createElement("p")
	bot_introd_paragraph.className="questionnaire";
	bot_introd_paragraph.innerHTML="Pod spodem znajduje się lista cech każdego gracza, z którymi zostały rozegrane poszczególne rundy. Proszę wybrać najtrafniejsze określenie dla każdego gracza.<br>"+
	"Określenia to:"+
	"<ul><li> kooperujący <li> niekooperujący <li> początkowo skłonny do kooperacji ale reagujący na działanie gracza (przyjazny, a potem odwetowy) <li>  początkowo nieskłonny do kooperacji ale reagujący na działanie gracza (nieprzyjazny, a potem odwetowy)";
	form_element.appendChild(bot_introd_paragraph)
	
	for (var bot = 0; bot < game_botlist.length; bot++) {
				var question_div=document.createElement("div");
				question_div.id="question_b_"+(bot+1);
				var bot_label = document.createElement("div");
				bot_label.innerHTML=bots_names_randomed[bot]
				var bot_html_img= document.createElement('img')
				bot_html_img.src="test "+game_botlist[bot]+".png";
				bot_html_img.className="bot_questionnaire";
				bot_label.appendChild(bot_html_img)
				question_div.appendChild(bot_label)
			
				var selectList = document.createElement("select");
				selectList.id = "bot_a_"+(bot+1);

				selectList.name = "bot_a_"+(bot+1);
				for (var i = 0; i < static_botlist.length; i++) {
					var inp = document.createElement('option');

					inp.value = static_botlist[i];
					inp.name = "bot_a_option"+(i+1);
					inp.id = "answer_b_"+(i+1);

					var itemLabel = document.createElement("Label");
					itemLabel.setAttribute("for", "answer_b_"+(i+1));
					if (static_botlist[i]=="wet koop") {var label = "przyjazny, a potem odwetowy" }
					else if (static_botlist[i]=="wet niekoop") {var label ="nieprzyjazny, a potem odwetowy"}
				 	else if (static_botlist[i]=="koop") {var label = "kooperujacy" }
				 	else if (static_botlist[i]=="niekoop") {var label = "niekooperujacy" }

					itemLabel.innerHTML = label;
					inp.appendChild(itemLabel);
					selectList.appendChild(inp);
				}
		question_div.appendChild(selectList)
		form_element.appendChild(question_div)
	}
}

function create_scale_for_question(question_nr, question, parent, no_buttons, max_text,min_text){
	var question_div=document.createElement("div");
	question_div.id="question_"+question_nr;	question_div.className="scale_questions";

	var p = document.createElement("p");
	p.className="questionnaire";
	var text = document.createTextNode(question_nr+". "+question+" Wg mnie:");
	p.appendChild(text);
	question_div.appendChild(p);

	var min =  document.createElement("span");
	min.innerHTML = min_text+"  ";
	question_div.appendChild(min);

	for (var i = 0; i < no_buttons; i++) {
			var inp = document.createElement("input");
			inp.type = "radio";
			inp.name = "q_"+(question_nr);
			inp.id = "answer"+i;
			inp.value=i+1
			question_div.appendChild(inp);
			
			var itemLabel = document.createElement("Label");
			itemLabel.setAttribute("for", "answer"+i);
			itemLabel.innerHTML = i+1;
			question_div.appendChild(itemLabel);
			}

	var max = document.createElement("span")
	max.innerHTML = "   "+max_text;
	question_div.appendChild(max);
	parent.appendChild(question_div)
}

function submit_form(form_element){
			question_list=[];
			var all_checked=true;			var divs = form_element.getElementsByClassName("scale_questions");
			if (czy_w_zwiazku=="zwiazek_tak") {			for (var div_id=0; div_id < divs.length; div_id++){

				for (var div_id=0; div_id < divs.length; div_id++){
					var questions = divs[div_id].getElementsByTagName("input")
					var is_checked = false;
					for(var question_id=0; question_id<questions.length; question_id++){
							if (questions[question_id].checked==true) {is_checked = true;}
							}					question_list.push(is_checked);
					}						
				for (var i; i<questions.length; i++){
						if (question_list[i]==false) {all_checked=false}
					}

				if (all_checked==true){
					form_element.submit();
					}
				else {console.log("not all checked");						return false
					}			}
			}
			else { 
					form_element.submit();
			}
	}


//change bot after 6 questions
function change_bot(){
	results_text.value=""
	score=0
	bot_score=0
	current_round+=1
	var index_of_current_bot = botlist.indexOf(current_bot);
	game_botlist.push(botlist[index_of_current_bot])
	botlist.splice(index_of_current_bot,1);
	var new_bot_index = Math.floor(Math.random() * botlist.length);
	current_bot=botlist[new_bot_index];
	get_bot()
	bot_avatar.src ="test "+current_bot+".png";
	current_bot_question=1
}

//Generate random name for bot
function get_bot(){
var index = Math.floor(Math.random() * nick_list.length)
var bot = nick_list[index]
nick_list.splice(index,1);
//ad smthin
var random_seed=Math.random()
var added_text = ""
if (random_seed <0.15) {added_text = Math.floor(Math.random() * 9999)}
else if (random_seed <0.50) {added_text = (Math.floor(Math.random() *19) +80)}
else if (random_seed <0.60) {added_text = "PL"}
else {}

bot = bot + added_text
bots_names_randomed.push(bot)
bot_name.innerHTML=bot
}


//Define Bot AI
function get_bot_answer(){
	var seed= Math.random();
	index=currentQuestion-2;
	if (current_bot=="koop"){ if (seed<0.8) {return 1} else {return 0}}
	else if (current_bot=="wet koop")   {if (current_bot_question==1) {return 1} else {return (data[index][1])}}
	else if (current_bot=="niekoop"){ if (seed>0.8) {return 1} else {return 0}}
	else if (current_bot=="wet niekoop"){if (current_bot_question==1) {return 0} else {return (data[index][1])}}
}

  
//After ending the questions
function showResults(final) {
		game_botlist.push(current_bot)
		end_time = Math.floor(Date.now() / 1000)
		cooperation_list.push(round_cooperation_counter);								
		setTimeout(function(){show_bot_form();}, 500);
}  
 
// //Save stats into CSV
// function save_to_csv(){
// 	var csvContent = "data:text/csv;charset=utf-8,";
// 	csvContent+="pytanie,wybor_gracza,wybor_bota,bot"+"\n";
// 	data.forEach(function(infoArray, index){
// 		   infoArray[1]=options_list[infoArray[1]]
// 		   infoArray[2]=options_list[infoArray[2]]
// 		   dataString = infoArray.join(",");
// 		   csvContent += index < data.length ? dataString+ "\n" : dataString;
// 	}); 

// 	var encodedUri = encodeURI(csvContent);
// 	window.open(encodedUri);
// }