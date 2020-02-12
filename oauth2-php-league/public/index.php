<?php

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Token\AccessToken;

require_once __DIR__.'/../vendor/autoload.php';

$provider = new GenericProvider([
    'clientId' => 'fa450dc29ccbdb4acb353e70a986edb8',
    'clientSecret' => 'a1d087984c410fc7b4680581291988449394456e13e0fd79f362e7b8ae07a008e30afab29d47a606c0f5627b9f6a3cb653de497802c00a066cd5da369b7ffe6395283e282f71e66ebf18c8620bbd8c19f9ed850475f255cb30457768a2ca26c03ec5077552266e80ca0deafcd30ecb536b260c499134f37e125ebf97dc34ece5aa95df8c4d4b41a99751b6e6a70fc8947458261a981de8d0efe9d73d2a44d7c122934414353fb268f5e8796a51f123ea89fe3b6242538ac597c89a75414e1445a95746c5d41e8603e6d3d8ab73734cb56368e206efd6a0365eb1c42d9fa587ee1a871574245f81926819462fb92cb05a6488aec11107c63ac5f218899ffd04dd',
    'redirectUri' => 'http://localhost:8080',
    'urlAuthorize' => 'https://recette-accounts.mesdocteurs.com/oauth/authorize',
    'urlAccessToken' => 'https://recette-accounts.mesdocteurs.com/oauth/token',
    'urlResourceOwnerDetails' => 'https://recette-accounts.mesdocteurs.com/whoami',
]);

if (!isset($_GET['code'])) {
    $authorizationUrl = $provider->getAuthorizationUrl([
        'scope' => ['profile'],
    ]);

    $_SESSION['oauth2_state'] = $provider->getState();

    header(sprintf('Location: %s', $authorizationUrl));
    exit;
} else if (empty($_GET['state']) || (isset($_SESSION['oauth2_state']) && $_GET['state'] !== $_SESSION['oauth2_state'])) {
    if (isset($_SESSION['oauth2_state'])) {
        unset($_SESSION['oauth2_state']);
    }

    http_response_code(403);
    exit;
} else {
    try {
        /** @var AccessToken $accessToken */
        $accessToken = $provider->getAccessToken('authorization_code', [
            'code' => $_GET['code'],
        ]);

        echo '<pre>';
        var_dump($accessToken);
        echo '</pre>';

        $resourceOwner = $provider->getResourceOwner($accessToken);

        echo '<pre>';
        var_dump($resourceOwner->toArray());
        echo '</pre>';
    } catch (IdentityProviderException $e) {
        exit($e->getMessage());
    }
}
