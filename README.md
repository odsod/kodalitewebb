# Koda lite webb!!

* [GitHub's Student Developer Pack](https://education.github.com/pack)

## Skaffa en server

* [DigitalOcean](https://www.digitalocean)
* Glöm inte att generera rabattkod från GitHub!

### Skapa en SSH-nyckel

[SSH](http://en.wikipedia.org/w/index.php?title=Secure_Shell) är ett protokoll
att logga in på och administrera servrar.

För att använda SSH behöver du din egen, personliga SSH-nyckel.

Aldrig använt SSH innan?

* DigitalOcean har en bra
  [tutorial för Windows-användare](https://www.digitalocean.com/community/tutorials/how-to-create-ssh-keys-with-putty-to-connect-to-a-vps).
* GitHub har en bra
  [tutorial för Mac- och Linuxanvändare](https://help.github.com/articles/generating-ssh-keys/#platform-linux).

### Skapa en VPS

Börja med att ladda upp din publika SSH-nyckel:

* [SSH keys](https://cloud.digitalocean.com/ssh_keys)
  * [Add SSH Key](https://cloud.digitalocean.com/ssh_keys#new_ssh_key_form)

Sedan skapar du din VPS:

* [Create droplet](https://cloud.digitalocean.com/droplets/new)
  * *Droplet hostname*: Namnet på din server, helt orelaterat till.
     domännamnet, som du kommer skaffa separat lite senare. I dessa
     exempel döper jag servern till `vps`.
  * *Select size*: börja med den billigaste.
  * *Select region*: Välj Amsterdam eller London, så får du bäst latens när du
     loggar in med SSH.
  * *Select image*: Ubuntu 14.04 x64 är en
                    [LTS-version](https://wiki.ubuntu.com/LTS)
                    som passar utmärkt för servrar.
  * *Add SSH keys*: Du borde se namnet på nyckeln du tidigare laddat upp.
     Klicka på den, så att knappen blir blå!

Du borde nu se din sprillans nya VPS i listan över dina servrar, notera
dess IP, för nu ska vi skaffa ett domännamn som pekar till den IP-adressen.

## Skaffa ett domännamn

* Använd [GitHub's Student Developer Pack](https://education.github.com/pack)
  för att få ett gratis `.me`-domännamn i ett år.

När du registrerat dig och fixat ditt domännamn, behöver du göra följande:

* Klicka på ditt användarnamn längst upp till vänster i menyn.
* *Manage domains*
* Klicka på ditt domännamn i listan.
* Klicka på *URL-forwarding* i den vänstra menyn.
* Fyll i den översta raden med följande:
   `@ [<din-vps-ip>] [A (Address)] n/a [1800]`
* *Save Changes*

Grattis, du har nu en egen server, med ett eget domännamn!

## Fixa iordning din server

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

root@vps:~#
~~~

Om du kör Windows, hänvisa tillbaka till DigitalOceans
[tutorial för Windows-användare](https://www.digitalocean.com/community/tutorials/how-to-create-ssh-keys-with-putty-to-connect-to-a-vps).

### Skapa en användare

Man ska helst inte rota runt på en server som `root`-användaren, den har
nämligen tillåtelse att göra vad som helst, till exempel radera hela
filsystemet. Det är typiskt dåligt.

Skapa istället en användare för dig själv:

~~~
root@vps:~# adduser user

Adding user `user' ...
Adding new group `user' (1001) ...
Adding new user `user' (1001) with group `user' ...
Creating home directory `/home/user' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
~~~

Du behöver också tillåta din SSH-nyckel för din nyskapade användare.

Ett smidigt sätt att göra detta är att kopiera `.ssh`-mappen från
`root`-användaren till din nya användare.

~~~
root@vps:~# cp -r /root/.ssh /home/user/.ssh
~~~

Du behöver också överföra ägarskapet av `/home/user/.ssh`-mappen till
din nya användare, just nu ägs den av `root`-användaren.

~~~
root@vps:~# chown -R user:user /home/user/.ssh
~~~

Nu ska du kunna SSHa som din nya användare, så logga ut `root`-användaren:

~~~
root@vps:~# exit
~~~

och SSHa in som dig själv:

~~~
$ ssh -A user@ditthostnamn.me

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

user@vps:~$
~~~

Wohoo, nu kan vi skrida till verket!

## Exempelkod från livekodningen

Koden från livekodningen finns tillgänglig i detta GitHub repository.

Om du aldrig använt git eller och GitHub innan kan
[denna tutorial](https://guides.github.com/activities/hello-world/#repository).
vara till hjälp.

Börja med att installera git på din server:

~~~
user@vps:~$ sudo apt-get install git
~~~

Klona sedan detta repo:

~~~
user@vps:~$ git clone https://github.com/odsod/kodalitewebb
~~~

~~~
user@vps:~$ cd kodalitewebb
user@vps:~/kodalitewebb$ ls
~~~

Dags att installera [Nginx](http://nginx.org), vår webbserver.

~~~
user@vps:~$ sudo apt-get install nginx
~~~

Nu vill vi konfigurera Nginx så att den servar filer från vårt
git-repository.

Om du inte är van vid att editera filer via kommandoraden har jag
förberett en Nginx-konfig som du inte behöver ändra i, förutsatt att du
döpte din användare till `user`.

Börja med att ta bort default-konfigureringen:

~~~
user@vps:~/kodalitewebb$ sudo rm /etc/nginx/sites-enabled/default
~~~

Symlänka sedan in vår konfigurering:

~~~
user@vps:~/kodalitewebb$ sudo ln -s $PWD/nginx.conf.template /etc/nginx/sites-enabled/kodalitewebb
~~~

Den nya konfigureringen tar kraft så snart vi startar om Nginx:

~~~
user@vps:~/kodalitewebb$ sudo service nginx restart
~~~

Om du surfar in på din sajt nu, så bör du se vår `index.html`-sida, men
chatten fungerar inte, eftersom vi måste starta vår chattserver först.

Börja med att installera [Node.js](http://nodejs.org) och
[npm](https://www.npmjs.org).

~~~
user@vps:~/kodalitewebb$ sudo apt-get install nodejs npm
~~~

Vår chattserver använder sig av [Express](http://expressjs.com), ett
mycket användbart bibliotek när man kodar servrar.

För att installera alla module vi dependar på:

~~~
user@vps:~/kodalitewebb$ npm install
~~~

Starta servern, håll tummarna, och refresha din sajt!

~~~
user@vps:~/kodalitewebb$ nodejs server.js
~~~
