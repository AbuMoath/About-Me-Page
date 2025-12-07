<?php
/**
 * Contact Form Handler
 * Processes form submissions and sends email notifications
 */

// Configuration
$to_email = "khaled@example.com"; // Change this to your actual email
$subject_prefix = "Portfolio Contact: ";
$success_message = "Thank you for your message! I'll get back to you soon.";
$error_message = "Oops! Something went wrong. Please try again.";

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize and validate input
    $name = sanitize_input($_POST["name"]);
    $email = sanitize_input($_POST["email"]);
    $subject = sanitize_input($_POST["subject"]);
    $message = sanitize_input($_POST["message"]);
    
    // Validation
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If no errors, proceed with sending email
    if (empty($errors)) {
        
        // Prepare email
        $email_subject = $subject_prefix . $subject;
        
        // Email body
        $email_body = "New contact form submission:\n\n";
        $email_body .= "Name: " . $name . "\n";
        $email_body .= "Email: " . $email . "\n";
        $email_body .= "Subject: " . $subject . "\n\n";
        $email_body .= "Message:\n" . $message . "\n";
        
        // Email headers
        $headers = "From: " . $email . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Send email
        if (mail($to_email, $email_subject, $email_body, $headers)) {
            // Success - redirect back with success message
            header("Location: index.html?status=success");
            exit();
        } else {
            // Error sending email
            header("Location: index.html?status=error");
            exit();
        }
        
    } else {
        // Validation errors - redirect back with error
        header("Location: index.html?status=error&message=" . urlencode(implode(", ", $errors)));
        exit();
    }
    
} else {
    // Not a POST request - redirect to home
    header("Location: index.html");
    exit();
}

/**
 * Sanitize user input
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Alternative: Save to database instead of email
 * Uncomment and configure if you prefer to save messages to a database
 */
/*
function save_to_database($name, $email, $subject, $message) {
    try {
        // Database configuration
        $host = "localhost";
        $dbname = "your_database";
        $username = "your_username";
        $password = "your_password";
        
        // Create connection
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Prepare SQL statement
        $sql = "INSERT INTO contact_messages (name, email, subject, message, created_at) 
                VALUES (:name, :email, :subject, :message, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        
        // Execute
        $stmt->execute();
        
        return true;
        
    } catch(PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}
*/

/**
 * SQL to create the contact_messages table (if using database approach):
 * 
 * CREATE TABLE contact_messages (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     name VARCHAR(100) NOT NULL,
 *     email VARCHAR(100) NOT NULL,
 *     subject VARCHAR(200) NOT NULL,
 *     message TEXT NOT NULL,
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *     status ENUM('new', 'read', 'replied') DEFAULT 'new'
 * );
 */
?>