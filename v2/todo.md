0) user surname remove and add regulations for the username example(20 chars max)
1) user.role - admin,hider, seeker
  <!-- Combo box (roles) -->
    <div>
      <label for="role">Select a role:</label>
      <select id="role" aria-label="User role">
        <option value="admin">Admin</option>
        <option value="seeker">Seeker</option>
        <option value="hider">Hider</option>
      </select>
    </div>
    
2) remove user.gender
3) coin.status - found,hidden
4) -app
    - control.panel
        - login
        - register
        - users.list
        - user.details
        - message
        - map.points
        - map.point.details
        - settings
        - about
    - map
     - coins rendered in a map managed by leafletjs
       (see: C:\my.desktop\projects\.mind.maps\main\software\dani\maps\tests\LeafletTutorial\LeafletTutorial1\.tutorials.html)
