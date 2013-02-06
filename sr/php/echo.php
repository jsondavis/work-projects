<?php

function emailIT($category, $description, $name, $branch){
    $to = 'jfenn@nassaulens.com'; // change this to the It group email
    $subject = 'Unresolved System Issue Reported';
    $message = $category . "\n\n" . $description . "\n\nReported by:\n" . $name . "@$branch";
    mail($to, $subject, $message);
}

$username = 'root';
$password = 'Nicom01';
$SALT = 'Who LiVeS INN a pineAPPle under The SEA?';

Class FullLogin{
    public $name;
    public $branch;
    public $supervisor;
    public function makearray(){
        return array('name' => $this->name, 'branch' => $this->branch, 'supervisor' => $this->supervisor, 'login'=> true);
    }
}

$admin = array('neil.rosen@nassaulens.com', 'jfenn@nassaulens.com');

$retarray = array('login'=>false);

if(empty($_POST)){

    $retarray = array('there', 'are', 'no', 'values');

}else{

    if($_POST['login'] == 'login'){

        $email = $_POST['email'];
        $pass = $_POST['password'];

        // check db for correct email pw
        // dont forget to hash pw!!!
        try{

        $conn = new PDO('mysql:host=localhost;dbname=sr', $username, $password );
        $stmt = $conn->prepare('SELECT * FROM sr.users WHERE email = :email AND password_hash = :pass LIMIT 1');
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'FullLogin');
        $stmt->execute(array(':email' => $email, ':pass' => crypt($pass, $SALT)));
            if($stmt->rowCount() > 0){
                while($user = $stmt->fetch()){
                    $retarray = $user->makearray();
                }
                if(is_array($retarray)){
                    $retarray['admin'] = in_array($email, $admin);
                } 
            }
        }catch (PDOException $e){
            $retarray = array('error' => $e->getMessage());
        }

    }else if($_POST['login'] == 'return'){

        $name = 'returnname';
        $branch = 'somebranch';
        $supervisor = true;

        // verify the above data with the db
        // if it is good continue

        $email = 'emailfromdb';

        if(in_array($email, $admin)){
            $admin = true;
        }else{
            $admin = false;
        }

        $retarray = array('name' => $name, 'branch' => $branch, 'supervisor' => $supervisor, 'login'=> true);

    }else if($_POST['login'] == 'feedback'){
    
        $retarray = $_POST;

        $name = $_POST['name']; 
        $branch = $_POST['branch']; 
        $account = $_POST['account']; 
        $order_invoice = $_POST['order_invoice'];
        $category = $_POST['category'];
        if($_POST['resolved']){
            $resolved = $_POST['resolved'];
        }else{
            $resolved = 'unresolved';
        }
        $description = $_POST['description']; 
        $time = time();

        if(strpos($category, 'System Issues') !== false && $resolved === 'unresolved'){
            emailIT($category, $description, $name, $branch);    
        }

        try{

        $conn = new PDO('mysql:host=localhost;dbname=sr', $username, $password );
        $stmt = $conn->prepare('INSERT INTO srdata VALUES (NULL, :time, :name, :branch, :account, :order_invoice, :category, :resolved, :description, 0)'); 
        $stmt->execute(array(':account' => $account, ':order_invoice' => $order_invoice, ':resolved' => $resolved, 
                             ':name' => $name, ':branch' => $branch, ':time' => $time,
                             ':category' => $category, ':description' => $description ));
        if($stmt->rowCount() == 1){
            $retarray = array('feedback' => 'feedback added', 'resolved?' => $_POST['resolved']);
        }
        }catch(PDOException $e) {
            // could catch exception here
            $retarray = array('error' => $e->getMessage());
        }
        



    }else if($_POST['login'] == 'signup'){
    
        // add in error checking here
        // and validation
        // and also password hashing
        $name = $_POST['name'];
        $email = $_POST['email'];
        $branch = $_POST['branch'];
        $supervisor = 0;
        $pass = $_POST['password'];

        try{

        $conn = new PDO('mysql:host=localhost;dbname=sr', $username, $password );
        $stmt = $conn->prepare('INSERT INTO users VALUES (:name, :branch, :email, :supervisor, :password_hash)'); 
        $stmt->execute(array(':email' => $email, ':password_hash' => crypt($pass, $SALT), 
                             ':name' => $name, ':branch' => $branch, 
                             ':supervisor' => $supervisor ));
        if($stmt->rowCount() == 1){
            $retarray = array('name' => $name, 'branch' => $branch, 'supervisor' => $supervisor, 'login'=> true);
        }
        }catch(PDOException $e) {
            // could catch exception here
            $retarray = array('error' => $e->getMessage());
        }
        
    }else if($_POST['login'] == 'feedback-update'){
    
        $retarray = $_POST;

        $issueid = $_POST['issueid'];
        $name = $_POST['name']; 
        $branch = $_POST['branch']; 
        $account = $_POST['account']; 
        $order_invoice = $_POST['order_invoice'];
        $category = $_POST['category'];
        if($_POST['resolved']){
            $resolved = $_POST['resolved'];
        }else{
            $resolved = 'unresolved';
        }
        $description = $_POST['description']; 
        $time = time();

        try{

        $conn = new PDO('mysql:host=localhost;dbname=sr', $username, $password );
        $stmt = $conn->prepare('INSERT INTO srdata_updated SELECT * FROM srdata WHERE id = :id');
        $stmt->execute(array(':id' => $issueid));

        $stmt = $conn->prepare('UPDATE srdata SET account = :account, order_invoice = :order_invoice, category = :category, resolved = :resolved, description = :description, updated = 1 WHERE id = :id');
        $stmt->execute(array(':account' => $account, ':order_invoice' => $order_invoice, ':resolved' => $resolved, 
                             ':id' => $issueid, ':category' => $category, ':description' => $description ));
        if($stmt->rowCount() == 1){
            $retarray = array('feedback' => 'update added');
        }
        }catch(PDOException $e) {
            // could catch exception here
            $retarray = array('error' => $e->getMessage());
        }
    } 


}

echo json_encode($retarray);

?>
