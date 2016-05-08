<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<?php
// foreach ($_POST as $param_name => $param_val) {
//     echo "Param: $param_name; Value: $param_val<br />\n";
// }

if ($_POST){
    $keys = array('plec','wiek','wyksztalcenie','czy_w_zwiazku','czy_malzenstwo','staz','nick', 'time_spent', 'coop_1', 'coop_2','coop_3', 'coop_4', 'bot_1', 'bot_2', 'bot_3', 'bot_4', 'bot_a_1','bot_a_2','bot_a_3','bot_a_4','q_1','q_2','q_3','q_4','q_5','q_6','q_7','q_8','q_9','q_10','q_11','q_12','q_13','q_14','q_15',);
    $csv_line = array();
    foreach($keys as $key){
        array_push($csv_line,'' . $_POST[$key]);
    }
    $fname = 'wyniki.csv';
    $key_names = 'plec,wiek,wyksztalcenie,zwiazek,malzenstwo,staz,nick,czas,koop_1,koop_2,koop_3,koop_4,bot_1,bot_2,bot_3,bot_4,ocena_1,ocena_2,ocena_3,ocena_4, q_1, q_2, q_3, q_4 , q_5 , q_6 , q_7 , q_8 , q_9, q_10 , q_11, q_12 ,q_13, q_14 , q_15'    
    $csv_line = implode(',',$csv_line);
    if(!file_exists($fname)){$csv_line = $key_names . PHP_EOL . $csv_line . PHP_EOL;}
    $fcon = fopen($fname,'a');
    $csv_line = PHP_EOL . $csv_line;
    fwrite($fcon,$csv_line);
    fclose($fcon);
}

echo "Bardzo dziękuje za udział w grze i badaniu."
?>