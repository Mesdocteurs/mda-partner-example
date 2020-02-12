<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @Route("/")
 *
 * @author Quentin Schuler aka Sukei <qschuler@neosyne.com>
 */
class DefaultController extends AbstractController
{
    /**
     * @param TokenInterface|null $token
     * @param UserInterface|null  $user
     *
     * @return Response
     */
    public function __invoke(TokenInterface $token = null, UserInterface $user = null): Response
    {
        return $this->render('home.html.twig', [
            'token' => $token,
            'user' => $user,
        ]);
    }
}
