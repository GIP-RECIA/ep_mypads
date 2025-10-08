# MyPads

Ce dépôt git héberge le code source du plugin MyPads pour Etherpad.

## Description

MyPads est considéré comme stable.

MyPads propose la gestion :

* des utilisateurs et leur authentification;
* de groupes de pads, illimités par utilisateur, partageables;
* des pads associés, avec le choix d'inviter des utilisateurs inscrits à les utiliser, d'y mettre un mot de passe ou de les rendre publics.

## Prérequis

* NodeJS >= 20
* Etherpad >= 2.3.1

## Installation

MyPads est publié sur NPM. Vous pouvez de fait l'installer directement depuis l'interface d'administration d'etherpad. Vous pourriez avoir besoin de redémarrer votre instance une fois le plugin installé.
ATTENTION: si vous désinstallez MyPads, toutes les données associées seront définitivement *supprimées*.



### Installation manuelle

À l'heure actuelle, MyPads est disponible publiquement sur NPM. Vous pouvez donc l'installer depuis l'administration d'Etherpad. Il se peut que vous deviez redémarrer votre instance Etherpad après l'installation du plugin.

ATTENTION : si vous désinstallez MyPads, toutes ses données seront définitivement supprimées.

## Configuration

Configurez un utilisateur administrateur dans le fichier `settings.json` d’Etherpad et utilisez ses identifiants sur http://youretherpad/mypads/?/admin

## Feuille de route

Elle est disponible au travers [des étapes et tickets](https://framagit.org/framasoft/Etherpad/ep_mypads/-/issues).
