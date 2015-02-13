# Koda lite webb!!

## Registrera dig på GitHub

[GitHub](https://github.com) är ett ställe där folk delar med sig av och
bygger open source-kod.

Skapa ett konto på [GitHub](https://github.com) och klicka till dig deras
[studentpaket](https://education.github.com/pack). Många bra
gratisgrejer här.

## Skaffa en server

Ett billigt och enkelt sätt att komma igång med sin egen Linux-server är
att skaffa sig en
[VPS](http://en.wikipedia.org/w/index.php?title=Virtual_private_server).

I GitHubs studentpaket ingår $100 hos
[DigitalOcean](https://www.digitalocean).

Scrolla ner till DigitalOcean i listan över olika rabatter, och generera
din kod. Du behöver den alldeles trax, när du registrerar dig på
DigitalOcean.

Ja, även om du inte betalar något så behöver du skriva in dit
kreditkortsnummer. It's the price of doing business.

Klar med det? Dags att skrida till verket.

### Skapa en SSH-nyckel

[SSH](http://en.wikipedia.org/w/index.php?title=Secure_Shell) är ett protokoll
att logga in på och administrera servrar.

För att använda SSH behöver du din egen, personliga SSH-nyckel.

DigitalOcean har en bra
[tutorial för Windows-användare](https://www.digitalocean.com/community/tutorials/how-to-create-ssh-keys-with-putty-to-connect-to-a-vps).
GitHub har en bra
[tutorial för Mac- och Linuxanvändare](https://help.github.com/articles/generating-ssh-keys/#platform-linux).

### Skapa en VPS

Efter att du
[laddat upp din SSH-nyckel på DigitalOcean](https://cloud.digitalocean.com/ssh_keys),
gör följande:

1. *Create droplet*
1. *Droplet hostname*: Namnet på din server, helt orelaterat till.
   domännamnet, som du kommer skaffa separat lite senare.
1. *Select size*: börja med den billigaste.
1. *Select region*: Välj Amsterdam eller London, så får du bäst latens när du
   loggar in med SSH.
1. *Select image*: Ubuntu 14.04 x64, det blir skitbra. 14.04 är en
   [LTS-version](https://wiki.ubuntu.com/LTS) som passar utmärkt för servrar.
1. *Add SSH keys*: Du borde se namnet på nyckeln du tidigare laddat upp.
   Klicka på den, så att knappen blir blå!

Du borde nu se din sprillans nya VPS i listan över dina servrar, notera
dess IP, för nu ska vi skaffa ett domännamn som pekar till den IP-adressen.

## Skaffa ett domännamn

Gå tillbaka till ditt [studentpaket på
GitHub](https://education.github.com/pack) och scrolla ner till Namecheap.

Generera en kod som ger dig rätt till ett gratis `.me`-domännamn i ett år.
(Någon har redan registrerat `poscar.me`, wtf!?)

När du registrerat dig och fixat ditt domännamn, behöver du göra följande:

1. Klicka på ditt användarnamn längst upp till vänster i menyn.
1. *Manage domains*
1. Klicka på ditt domännamn i listan.
1. Klicka på *URL-forwarding* i den vänstra menyn.
1. Fyll i den översta raden med följande:
   `@ [<din-vps-ip>] [A (Address)] n/a [1800]`
1. *Save Changes*

Grattis, du har nu en egen server, med ett eget domännamn!

## Konfigurera din server

Nu kan du SSH:a till din nya server och börja mecka med den!

Om du kör OSX eller Linux:

~~~
ssh -A root@ditthostnamn.me

Welcome to Ubuntu 14.04.1 LTS (GNU/Linux 3.13.0-43-generic x86_64)

 * Documentation:  https://help.ubuntu.com/

  System information as of Wed Feb 11 16:36:17 EST 2015

  System load:  0.0               Processes:           90
  Usage of /:   5.2% of 39.25GB   Users logged in:     0
  Memory usage: 8%                IP address for eth0: 178.62.209.139
  Swap usage:   0%

  Graph this data and manage this system at:
    https://landscape.canonical.com/

Last login: Wed Feb 11 12:12:36 2015 from 82.99.14.165

root@dittservernamn:~#
~~~

Om du kör Windows, hänvisa tillbaka till DigitalOceans
[tutorial för Windows-användare](https://www.digitalocean.com/community/tutorials/how-to-create-ssh-keys-with-putty-to-connect-to-a-vps).

### Skapa en användare

Man ska helst inte rota runt på en server som `root`-användaren, den har
nämligen tillåtelse att göra vad som helst, typ som att att radera hela
filsystemet. Det är typiskt dåligt.

Skapa istället en användare för dig själv:

~~~
# adduser dittnamn

Adding user `dittnamn' ...
Adding new group `dittnamn' (1001) ...
Adding new user `dittnamn' (1001) with group `dittnamn' ...
Creating home directory `/home/dittnamn' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
~~~

Du behöver också tillåta din SSH-nyckel för din nyskapade användare. Ett
smidigt sätt att göra detta är att kopiera `.ssh`-mappen från
`root`-användaren till din nya användare.

~~~
# cp -r /root/.ssh /home/dittnamn/.ssh
~~~

Du behöver också överföra ägarskapet av `/home/dittnamn/.ssh`-mappen till
din nya användare, just nu ägs den av `root`-användaren.

~~~
# chown -R dittnamn:dittnamn /home/dittnamn/.ssh
~~~

Nu ska du kunna SSHa som din nya användare, så logga ut `root`-användaren:

~~~
# exit
~~~

och SSHa in som dig själv:

~~~
$ ssh -A dittnamn@ditthostnamn.me

Welcome to Ubuntu 14.04.1 LTS (GNU/Linux 3.13.0-43-generic x86_64)

 * Documentation:  https://help.ubuntu.com/

  System information as of Wed Feb 11 16:36:17 EST 2015

  System load:  0.0               Processes:           90
  Usage of /:   5.2% of 39.25GB   Users logged in:     0
  Memory usage: 8%                IP address for eth0: 178.62.209.139
  Swap usage:   0%

  Graph this data and manage this system at:
    https://landscape.canonical.com/

Last login: Wed Feb 11 12:12:36 2015 from 82.99.14.165

dittnamn@dittservernamn:~$
~~~

Wohoo, nu kan vi snart börja koda!

### Skapa ett git-repository

Under live-kodningen editerade jag all kod med hjälp av
[vim](http://www.vim.org), en texteditor som kan köras i terminalen.

`vim` är dock lite knepigt att komma igång med. Du kan också editera din
kod lokalt på din egen dator, och använda `git` för att pusha upp koden
till din server.

Börja med att surfa till [GitHub](https://github.com) och skapa ett
repository för din kod.

Om du aldrig använt git eller och GitHub innan kan
[denna tutorial](https://guides.github.com/activities/hello-world/#repository).
vara till hjälp.
