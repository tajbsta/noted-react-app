import { Facebook, Instagram, Linkedin, Twitter } from 'react-feather';

export default function Footer() {
  return (
    <div id='Footer'>
      <div className='row footer-container'>
        <div className='col-lg-4 col-md-12 footer-item'>
          <div className='link-container'>
            <a href='javascript:void(0)' className='footer-link'>
              Terms &amp; Conditions
            </a>
            <div className='footer-link-divider'>|</div>
            <a href='javascript:void(0)' className='footer-link'>
              Privacy Policy
            </a>
          </div>
        </div>
        <div className='col-lg-4 col-md-12 footer-item'>
          <ul className='list-unstyled nav-items'>
            <li className='nav-item link'>
              <a href='javascript:void(0)'>
                <Facebook size={20} className='fill-svg' />
              </a>
            </li>
            <li className='nav-item link'>
              <a href='javascript:void(0)'>
                <Instagram size={20} />
              </a>
            </li>
            <li className='nav-item link'>
              <a href='javascript:void(0)'>
                <Linkedin size={20} className='fill-svg' />
              </a>
            </li>
            <li className='nav-item link'>
              <a href='javascript:void(0)'>
                <Twitter size={20} className='fill-svg' />
              </a>
            </li>
          </ul>
        </div>
        <div className='col-lg-4 col-md-12 footer-item'>
          <div className='footer-link'>
            All Rights Reserved 2021 &#169; notedreturns.com
          </div>
        </div>
      </div>
    </div>
  );
}
