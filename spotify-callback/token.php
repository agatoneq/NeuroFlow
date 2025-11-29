<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Spotify Configuration
$CLIENT_ID = '88fb4b331f304f33a835529c4c4792fa';
$CLIENT_SECRET = '19189dea95ab412bba83a0c7e3b4841d'; // Trzeba dodać Client Secret z Spotify Dashboard
$REDIRECT_URI = 'https://www.groupmta.com/neurofocus-callback/token.php';

// Sprawdź czy otrzymaliśmy authorization code
if (isset($_GET['code'])) {
    $code = $_GET['code'];
    
    // Wymień code na access token
    $ch = curl_init('https://accounts.spotify.com/api/token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $REDIRECT_URI,
        'client_id' => $CLIENT_ID,
        'client_secret' => $CLIENT_SECRET
    ]));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $accessToken = $data['access_token'];
        $expiresIn = $data['expires_in'];
        
        // Przekieruj z tokenem w URL (jak Implicit Grant)
        $redirectUrl = 'https://www.groupmta.com/neurofocus-callback/index.html';
        $redirectUrl .= '#access_token=' . $accessToken;
        $redirectUrl .= '&expires_in=' . $expiresIn;
        $redirectUrl .= '&token_type=Bearer';
        
        header('Location: ' . $redirectUrl);
        exit;
    } else {
        // Błąd - przekieruj z komunikatem
        $redirectUrl = 'https://www.groupmta.com/neurofocus-callback/index.html';
        $redirectUrl .= '#error=token_exchange_failed';
        header('Location: ' . $redirectUrl);
        exit;
    }
} else {
    // Brak code - przekieruj z błędem
    $redirectUrl = 'https://www.groupmta.com/neurofocus-callback/index.html';
    $redirectUrl .= '#error=no_authorization_code';
    header('Location: ' . $redirectUrl);
    exit;
}
?>
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$CLIENT_ID = '88fb4b331f304f33a835529c4c4792fa';
$CLIENT_SECRET = '19189dea95ab412bba83a0c7e3b4841d';
$REDIRECT_URI = 'https://www.groupmta.com/neurofocus-callback/token.php';

if (isset($_GET['code'])) {
    $code = $_GET['code'];
    
    $ch = curl_init('https://accounts.spotify.com/api/token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $REDIRECT_URI,
        'client_id' => $CLIENT_ID,
        'client_secret' => $CLIENT_SECRET
    ]));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $accessToken = $data['access_token'];
        $expiresIn = $data['expires_in'];
        
        $redirectUrl = 'https://www.groupmta.com/neurofocus-callback/index.html';
        $redirectUrl .= '#access_token=' . $accessToken;
        $redirectUrl .= '&expires_in=' . $expiresIn;
        $redirectUrl .= '&token_type=Bearer';
        
        header('Location: ' . $redirectUrl);
        exit;
    } else {
        $redirectUrl = 'https://www.groupmta.com/neurofocus-callback/index.html';
        $redirectUrl .= '#error=token_exchange_failed';
        header('Location: ' . $redirectUrl);
        exit;
    }
} else {
    $redirectUrl = 'https://www.groupmta.com/neurofocus-callback/index.html';
    $redirectUrl .= '#error=no_authorization_code';
    header('Location: ' . $redirectUrl);
    exit;
}
?>
