<?php

$username = 'blah';
$password = 'blah';

function EmailSuper($branch, $to, $records){
    $to = 'blah@blah';
    $subject = "$branch's Unresolved Reports";
    $message = "";
    foreach($records AS $value){
        $message .= "$value\n";    
    }
    mail($to, $subject, $message);
}

Class FeedbackData{
    public $account;
    public $category;
    public $description;
    public $time;
    public $name;
    public function makearray(){
        return array('account' => rawurldecode($this->account), 'category' => rawurldecode($this->category), 'description' => $this->description, 'time' => $this->time);
    }
    public function makeemail(){
        $minutes = ((time() - $this->time)/ 60);
        return "$this->account  - $this->category - $this->name @$this->time \n$this->description\n";
    }
} 

Class SingleIssue{
    public $name;
    public $branch;
    public $account;
    public $order_invoice;
    public $category;
    public $description;
    public $time;
    public function makearray(){
        return array('account' => $this->account, 'category' => $this->category, 'description' => $this->description, 'time' => $this->time, 'name' => $this->name, 'branch' => $this->branch, 'order_invoice' => $this->order_invoice );
        
    }
}

$retarray = array('issues' => array());

if(!empty($_POST)){


        try{

        $conn = new PDO('mysql:host=localhost;dbname=sr', $username, $password );

        if(array_key_exists('aside', $_POST) && $_POST['aside'] == 'supervisor'){
            $name = $_POST['user'];    
            $branch = $_POST['branch'];
            $stmt = $conn->prepare('SELECT * FROM sr.srdata WHERE branch = :branch ORDER BY time DESC LIMIT 90'); 
            $stmt->setFetchMode(PDO::FETCH_CLASS, 'FeedbackData');
            $stmt->execute(array(':branch' => $branch));
        }else if(array_key_exists('issue', $_POST)){
            $issueid = $_POST['issue']; 
            $stmt = $conn->prepare('SELECT * FROM sr.srdata WHERE id = :issue');
            $stmt->setFetchMode(PDO::FETCH_CLASS, 'FeedbackData');
            $stmt->execute(array(':issue' => $issueid));
        }else{ 
            $name = $_POST['user'];    
            $branch = $_POST['branch'];
            $stmt = $conn->prepare('SELECT * FROM sr.srdata WHERE name = :name ORDER BY time DESC LIMIT 90');
            $stmt->setFetchMode(PDO::FETCH_CLASS, 'FeedbackData');
            $stmt->execute(array(':name' => $name));
            $retarray['name'] = $name;
        }
        $count = 0;
            while($issue = $stmt->fetch()){
                $retarray['issues'][$count] = $issue; 
                $count++;
            } 
        }catch(PDOException $e) {
            // could catch exception here
            $retarray = array('error' => $e->getMessage());
        }
}


echo json_encode($retarray);

?>
