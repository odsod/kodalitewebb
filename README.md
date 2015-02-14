# Koda lite webb!!

Börja här:

* [GitHub's Student Developer Pack](https://education.github.com/pack)

Skaffa sedan en server här:

* [DigitalOcean](https://www.digitalocean)

Glöm inte att använda din rabattkod från GitHub!

För att logga in på din server behöver du en
[SSH](http://en.wikipedia.org/w/index.php?title=Secure_Shell)-nyckel.

Aldrig använt SSH innan?

* DigitalOcean har en bra
  [tutorial för Windows-användare](https://www.digitalocean.com/community/tutorials/how-to-create-ssh-keys-with-putty-to-connect-to-a-vps).
* GitHub har en bra
  [tutorial för Mac- och Linuxanvändare](https://help.github.com/articles/generating-ssh-keys/#platform-linux).

Nu ska vi skapa vår egen VPS.

Börja med att ladda upp din publika SSH-nyckel på DigitalOcean:

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

The authenticity of host '188.166.12.226 (188.166.12.226)' can't be established.
ECDSA key fingerprint is 07:be:14:76:bd:75:1c:82:03:b1:d1:de:68:dc:1b:2b.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '188.166.12.226' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 14.04.1 LTS (GNU/Linux 3.13.0-43-generic x86_64)

 * Documentation:  https://help.ubuntu.com/

  System information as of Sat Feb 14 04:03:47 EST 2015

  System load: 0.0                Memory usage: 9%   Processes:       51
  Usage of /:  10.8% of 19.56GB   Swap usage:   0%   Users logged in: 0

  Graph this data and manage this system at:
    https://landscape.canonical.com/

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

Din nya användare kommer behöva `sudo`-rättigheter för att installera
saker. Såhär fixar du det:

~~~
root@vps:~# visudo
~~~

Du editerar nu filen `/etc/sudoers` med texteditorn `nano`. Använd
piltangerterna för att navigera ned till raden som ser ut såhär:

~~~
# User privilege specification
root    ALL=(ALL:ALL) ALL
~~~

Och gör så att den ser ut såhär:

~~~
# User privilege specification
root    ALL=(ALL:ALL) ALL
user    ALL=(ALL:ALL) ALL
~~~

För att spara: `Ctrl+X`, sedan `y`, sedan `Enter`.

Nu har din nya användare sudo-rättigheter!

Dags att SSHa in som din nya användare, så logga ut `root`-användaren:

~~~
root@vps:~# exit
~~~

och SSHa in som din nya användare:

~~~
$ ssh -A user@188.166.12.226

Welcome to Ubuntu 14.04.1 LTS (GNU/Linux 3.13.0-43-generic x86_64)

 * Documentation:  https://help.ubuntu.com/

  System load:  0.0                Processes:           67
  Usage of /:   11.2% of 19.56GB   Users logged in:     0
  Memory usage: 11%                IP address for eth0: 188.166.12.226
  Swap usage:   0%

  Graph this data and manage this system at:
    https://landscape.canonical.com/

0 packages can be updated.
0 updates are security updates.


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

user@vps:~$
~~~

Wohoo, dags skrida till verket!

## Exempelkod från livekodningen

Koden från livekodningen finns tillgänglig i detta GitHub repository.

Om du aldrig använt git eller och GitHub innan kan
[denna tutorial](https://guides.github.com/activities/hello-world/#repository).
vara till hjälp.

Först vill vi installera `git` på servern.

Börja med att hämta hem den senaste listan över vilka paket som går att installera:

~~~
user@vps:~$ sudo apt-get update
[sudo] password for user:
Ign http://security.ubuntu.com trusty-security InRelease
Get:1 http://security.ubuntu.com trusty-security Release.gpg [933 B]
Get:2 http://security.ubuntu.com trusty-security Release [62.0 kB]
...
~~~

Installera sedan `git`.

~~~
user@vps:~$ sudo apt-get install git
Reading package lists... Done
Building dependency tree
Reading state information... Done
...
Do you want to continue? [Y/n]
~~~

Klona sedan detta repo:

~~~
user@vps:~$ git clone https://github.com/odsod/kodalitewebb
~~~

~~~
user@vps:~$ cd kodalitewebb/
user@vps:~/kodalitewebb$ ls
client.js  index.html  README.md  server.js  style.css
~~~

Dags att installera [Nginx](http://nginx.org), vår webbserver.

~~~
user@vps:~/kodalitewebb$ sudo apt-get install nginx
Reading package lists... Done
...
After this operation, 9,055 kB of additional disk space will be used.
Do you want to continue? [Y/n]
~~~

Nu vill vi konfigurera Nginx så att den servar våra filer.

För att editera `/etc/nginx/sites-enabled/default` kan vi använda
texteditorn `nano`, samma editor som vi använde för att lägga till oss i
`/etc/sudoers`.

~~~
user@vps:~/kodalitewebb$ sudo nano /etc/nginx/sites-enabled/default

GNU nano 2.2.6               File: /etc/nginx/sites-enabled/default

# You may add here your
# server {
#       ...
# }
# statements for each of your virtual hosts to this file
...
~~~

Använd piltangenterna för att navigera till raderna som ser ut såhär:

~~~
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        root /usr/share/nginx/html;
~~~

och ändra så att de ser ut såhär:

~~~
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        root /home/user/kodalitewebb/public;
~~~

Nu kommer Nginx att serva filer från mappen
`/home/user/kodalitewebb/public` när man surfar in på vår sajt.

Vi behöver göra en sak till, nämligen vidarebefodra alla URLer som börjar
med `/api` till vår Node.js-server, som lyssnar på port `8080`.

Gå till raderna som ser ut såhär:

~~~
location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to displaying a 404.
        try_files $uri $uri/ =404;
        # Uncomment to enable naxsi on this location
        # include /etc/nginx/naxsi.rules
}
~~~

och ändå så att de ser ut såhär:

~~~
location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to displaying a 404.
        try_files $uri $uri/ =404;
        # Uncomment to enable naxsi on this location
        # include /etc/nginx/naxsi.rules
}

location /api {
        proxy_pass http://localhost:8080;
}
~~~

Spara genom att knappa in `Ctrl-x`, sedan `y`, sedan `Enter`.

Den nya Nginx-konfigen tar kraft så snart vi startar om Nginx:

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

Eftersom vår server behöver parsa JSON-objekt behöver vi också
installera modulen `body-parser`.

~~~
user@vps:~/kodalitewebb$ npm install express body-parser
~~~

Starta servern, håll tummarna, och refresha din sajt!

~~~
user@vps:~/kodalitewebb$ nodejs server.js
~~~

Funkar det?
