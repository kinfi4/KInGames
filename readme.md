# KinGames
KinGames is a fullstack web app, created using Django and React.  
This app was build by Ilya Makarov, KPI University student from Kiev, as a  
final project in EPAM Systems academy.  

The topic of website is internet shop for gamers, which provides an userfriendly interface for buying computer games.   
KinGames provides some comfortable features for filtering and searching games, in order to get exactly customer wants.  

This project is done using Django Rest Framework and React.js.  
There development and production docker files for easy deploy or testing.  

-----------------

Main page, where we can see nice mosaic of games 
<br />
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/1.png?raw=true" style="margin-top: 10px;" alt="main window" width="1000%"/>


Here we may see my filtering in action.
<br />
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/2.png?raw=true" style="margin-top: 10px;"  alt="main window" width="49%"/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/3.png?raw=true" style="margin-top: 10px;" alt="main window" width="49%"/>
<br/>

If user wants to order game, or just find out its details, he can just click on its picture <br />
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/game_details.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>
<br/>

Even as an anonymous user we can order games we like. We add games to the cart by clicking on appropriate button: <br/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/cart.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>

After we got all we want, just click on "PROCEED" button:  <br/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/order.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>


------------------
Anyway, unauthenticated users can use 100% of websites power. So lets dive into accounts.  <br />
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/login.png?raw=true" style="margin-top: 10px;" alt="main window" width="49%"/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/register.png?raw=true" style="margin-top: 10px;" alt="main window" width="49%"/>

We can just click on "Sing in" button at the top of the screen. <br/>

-----------------
        There are 3 types of accounts in KinGames: 
            - Users
            - Managers
            - Admins
        
        First is just a regular user, which can comment 
        games, and put his marks. Managers and Admins can 
        add new games, edit or delete excisting. Also both
        of them can delete users comments, if they disrupt
        KinGames chant rules. But anyway, edit comment can 
        only its author. The difference between Admins and 
        Managers is that admins can create new managers.

-----------------

Now I singed in Admin account, so that there is nothing I can not do now.  <br/>
First things first, we can edit our profile, or delete it, if we want.
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/edit_profile.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>

As an admin, now I can add new games, or edit existing: <br/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/create_game.png?raw=true" style="margin-top: 10px;" alt="main window" width="49%"/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/edit_game.png?raw=true" style="margin-top: 10px;" alt="main window" width="49%"/>

Also, I can delete games: <br />
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/delete_game.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>

I have already mentioned that as an Admin I can give manager privilege to users: <br/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/manage_users.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>
There we can also search users by first or last name. Also, this system is lazy, so dont thing that it loads all service users at once.  
It loads just 12 users and then, load additional users while we're scrolling down.  

----------------

Now, as we know what admin user can do, lets see what functionality gives authentication even to a regular user.  
Now we can give games our mark, so that other users will see weather we liked it or not. <br/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/marks.png?raw=true" style="margin-top: 10px;" alt="main window" width="70%"/>

The second feature is comments:  <br/>
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/comments.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>
We can write our comments, reply on comments, edit them or just delete.
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/manage_comments.png?raw=true" style="margin-top: 10px;" alt="main window" width="49%"/>
<br />

Worth mentioning that even if we press delete comment button, the comment wont be deleted, and we will see the "UNDO" button, to revert deleted comment,  
but if we reload the tab or leave this page, the DELETE request will be sent to the server, and your comment will flush away.
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/delete_comment.png?raw=true" style="margin-top: 10px;" alt="main window" width="49%"/>

We can also see the comment we replied on, by pressing on its link, right above our.  
If we press it, browser will scroll up to this comment, and will highlight it.
<img src="https://github.com/kinfi4/KInGames/blob/main/docs/screenshots/reply_comment.png?raw=true" style="margin-top: 10px;" alt="main window" width="100%"/>


        If you would like to clone this project, and run it. You can just type: 
            - git clone https://github.com/kinfi4/KInGames.git
            - cd KinGames
            - docker-compose -f docker-compose.dev.yml up

        Make sure that you have your .env.dev file in backend folder,
        where you specify essential environment variables.