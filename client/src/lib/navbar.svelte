<script>
    let isMenuOpen = false;
  
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
    }
  </script>
  
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <a href="/">My Website</a>
      </div>
      <div class="navbar-links">
        <a href="/">Home</a>
        <a href="/search">Search</a>
        <a href="/book">Books</a>
      </div>
      <div class="menu-icon" on:click={toggleMenu}>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="mobile-menu" class:open={isMenuOpen}>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </div>
  </nav>
  
  <style>
    /* Navbar styles */
    .navbar {
      background-color: black; /* Change the background color to blue */
      color: white;
      padding: 10px 0;
      font-family: 'Your Custom Font', sans-serif; /* Add your custom font here */
    }
  
    .container {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    .navbar-brand a {
      text-decoration: none;
      font-size: 24px;
      font-weight: bold;
      color: white;
    }
  
    .navbar-links a {
      text-decoration: none;
      color: white;
      margin-left: 20px;
    }
  
    /* Mobile menu styles */
    .menu-icon {
      display: none;
      flex-direction: column;
      cursor: pointer;
    }
  
    .bar {
      width: 30px;
      height: 3px;
      background-color: white;
      margin: 3px 0;
    }
  
    .mobile-menu {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 60px;
      right: 0;
      background-color: #007bff; 
      color: white;
      padding: 10px;
      width: 150px;
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
    }
  
    .mobile-menu.open {
      transform: translateX(0);
    }
  
    .mobile-menu a {
      text-decoration: none;
      color: white;
      margin-bottom: 10px;
    }
  
    @media (max-width: 768px) {
      .navbar-links {
        display: none;
      }
  
      .menu-icon {
        display: flex;
      }
    }
  </style>
  