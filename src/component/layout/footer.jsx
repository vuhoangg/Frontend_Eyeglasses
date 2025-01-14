
import './header.css'
const FooterLayout =()=>{
    return(
        <>
       <footer>
  <div class="footer-container">
    <div class="footer-left">
      <h3>MyWebsite</h3>
      <p>&copy; 2025 MyWebsite. All rights reserved.</p>
    </div>
    <div class="footer-center">
      <ul class="footer-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-right">
      <p>Follow us:</p>
      <div class="social-links">
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </div>
</footer>

        </>
    );
}

export default FooterLayout;