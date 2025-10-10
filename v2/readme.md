'main' -  https://chatgpt.com/c/68d3ee2e-1838-8328-a329-04ab9ac3e352
'how to exclude a folder from vscode workspace' - https://chatgpt.com/c/68d66d3c-76fc-8321-9b4d-f1577b5e5814
search for comments like this to find the changes:
it talks about v3 , but it's actually v2
now generate a new version where:
-1) introduce the concept of commands associated with each div 0) introduce two menu divs:
0.1) menu.top -docked at the top of the screen
0.2) menu.bottom -docked bottom at the of the screen

1.  each div has associated commands with it
2.  there is only one div visible at any moment besides the menu divs that
    have a special status and are always visible if ther are commands associated with them
3.  the menus(top and bottom) are filled by the commands associated with the currently visible div
4.  if none from the other divs is visible expand the menu and render the default commands
    which are showing the other divs when clicked
5.  thus the menu div should have the option to show the commands in 6 places:
    5.1) the title bar, which is displayed even when the menu div is collapsed (menu.top or bottom)
    5.2) the top part of the expanded div (menu.top or bottom)
    5.3) the bottom part of the expanded div (menu.top or bottom)
6.  thus each div.command has a poperty named menu.location , which can be one of the
    values in 5.1)..5.3)
    there is also a special command named "list.row" which is rendered as a button in each row of a list
    if there are no commands associated with menu.top div - hide it
    if there are no commands associated with menu.bottom div - hide it
7.  the commands related to each div are as follows:
    7.1) login page div
    - 7.1.1) command: ok, menu.location: menu.bottom.title
    - 7.1.2) command: cancel, menu.location: menu.bottom.title
    - 7.1.3) command: register, menu.location: menu.bottom.title
    7.2) register user div
    - 7.2.1) command: ok, menu.location: menu.bottom.title
    - 7.2.2) command: cancel, menu.location: menu.bottom.title
      7.3) users list div 
    - 7.3.1) command: add user, menu.location: menu.bottom.title
    - 7.3.2) command: refresh, menu.location: menu.bottom.title
    - 7.3.3) command: delete user, location: list.row ( displayed as a button in each row of the users list)
    - 7.3.4) command: edit user, caption:,image:  location: list.row ( displayed as a button in each row of the users list)
    
      7.4) user details div
    - 7.4.1) command: save, menu.location: menu.bottom.title
    - 7.4.2) command: delete, menu.location: menu.bottom.title
    - 7.4.3) command: cancel, menu.location: menu.bottom.title

      7.5) message div
    - 7.5.1) command: ok, menu.location: menu.bottom.title
    
      7.6) map points div
    - 7.6.1) command: add map point, menu.location: menu.bottom.title
    - 7.6.2) command: refresh, menu.location: menu.bottom.title
    - 7.6.3) command: delete map point, location: list.row
    - 7.6.4) command: edit map point, caption:,image:  location: list.row

      7.7) map point details div
    - 7.7.1) command: save, menu.location: menu.bottom.title
    - 7.7.2) command: delete, menu.location: menu.bottom.title
    - 7.7.3) command: cancel, menu.location: menu.bottom.title

      7.8) settings div
    - 7.8.1) command: apply, menu.location: menu.bottom.title
    - 7.8.2) command: reset, menu.location: menu.bottom.title
       
       7.9) about div
    - 7.9.1) command: ok, menu.location: menu.bottom.title


8.  the menu divs have the following default commands when no other div is visible:
    8.1) menu.top div
    - 8.1.1) command: show login, menu.location: menu.top.top
    - 8.1.2) command: show register, menu.location: menu.top.top
    - 8.1.3) command: show users list, menu.location: menu.top.top
    - 8.1.4) command: show map points, menu.location: menu.top.top
    - 8.1.5) command: show settings, menu.location: menu.top.top
    - 8.1.6) command: show about, menu.location: menu.top.top
    8.2) menu.bottom div

    9) menu.top div and menu.bottom div are hidden if there are no commands associated with them at any given moment
    10) each command has the following properties:
    - command.name - the name of the command, used to identify it in the code
    - command.caption - the caption of the command, used to display it in the UI
    - command.image - the image of the command, used to display it in the UI 
    - command.divId - the id of the element in the target div (users, points etc) associated with the command.
    - command.displayType-  text, image, text+image - how to display the command in the UI
    - command.html - the html code to be used to render the command in the UI - if not provided, a default button is used
    - command.menu.location - the location of the command in the menu, one of the values in 5.1)..5.3)
    - command.action - the function to be executed when the command is clicked
    - command.visible - boolean, whether the command is visible or not
    - command.enabled - boolean, whether the command is enabled or not


    also in the code like:
    renderPointsRow
    use backtick strings with variable interpolation to render the command html
        e.g.    html += `<td>${renderCommand(point, "delete map point")}</td>`;   



generate the relavant files for the new version so that i can download them and dont show me the details of your thinkng process, just the files.