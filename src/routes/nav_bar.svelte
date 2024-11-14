<script>
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }
    import "./style.css";
</script>

<nav class="nav">
    <img
        src="./src/assets/download.png"
        alt="alt-icon"
        height="40vh"
        width="40vw"
    />
    <button class="menu-btn" on:click={toggleMenu} aria-label="Toggle menu">
        <!-- SVG Icon for Menu -->
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
            />
        </svg>
    </button>
    <ul class="nav-links {isMenuOpen ? 'open' : ''}">
        <li><a href="/" on:click={closeMenu}>home</a></li>
        <li><a href="/about" on:click={closeMenu}>about</a></li>
        <li><a href="/profile" on:click={closeMenu}>profile</a></li>
        <li><a href="/cart" on:click={closeMenu}>cart</a></li>
    </ul>
</nav>
