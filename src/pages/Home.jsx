import React from 'react';
import heroVideo from "../assets/hero.mp4";
import "../styles/home.css";
import Button from "../components/Button";
import { formatDate } from '../utils/formatDate';
import MessageMover from '../components/MessageMover';
import StylishBox from "../components/StylishBox";

import ImageTextBox from '../components/Image_Text_Box';
import PromosCircle from '../components/PromosCircle';
import Chatform from '../components/Chatform';
import ChatButton from '../components/ChatButton';
import Comment from '../components/Comment';
import { Link } from 'react-router-dom';


function Home() {
    const today = new Date();

  return (
    <>
<div className="Home">
{/* .................................This is the homepage Hero section................................. */}
{/* These are the BG anim images */}
      
 <div className="heroSection">
  <video className="heroVideo" autoPlay loop muted playsInline>
    <source src={heroVideo} type="video/mp4" />
  </video>

  <div className="heroOverlay"></div>

  {/* MOVED INSIDE HERO SECTION */}
  <div className="captionShader">
      <div className="captionHeaderText urbanist">
          <p>Your cozy place <span>away, <br />from </span>home!</p>
      </div>

      <div className="captionMessage">
          <p>Book Your Stay Today!</p>

          <div className="pulse">
             <Link to="/reservations">
                <Button type="submit" btnLabel="Book Now"/>
             </Link>
          </div>
      </div>
  </div>

</div>


{/* ...........................Search bar section......................... */}
<div className="homeSection0">
       {/*  This is the first caption paragraph */}
          <p className="WelcomeParagraph">| Your perfect escape begins here. |</p>
</div>

{/* ..............................The WHY US section................................ */}
          <div className="homeSection1">
                <p className="why_Us">| Why Us</p>
                <h1 className="h1Text"><span>Offering,</span> a unique and exceptional experience!</h1>
                <StylishBox className="homeMessage1 TextDesign">
                    <p>Nestled amidst the bustling energy of the city, 
                       our hotel offers a serene escape where modern elegance
                       meets African charm. we pride ourselves on delivering an
                       unparalleled guest experience.
                    </p>
                    <div className="lightDesign"></div>
               </StylishBox>
          </div>

          <div className="section1RightImage appearOnScroll">
            <div className="style1 mainDivStyle">
                <div className="style2 mainDivStyle">
                   {/*  <div className="style3 mainDivStyle">
                    </div> */}
                    <ul>
                        <li>Affordable</li>
                        <li>Eeasy</li>
                        <li>Quick</li>
                    </ul>
                    <button >Explore More...</button>
                </div>
                </div>
            </div>
          <div className="clear"></div>

 {/*-------------------------------- This is the featured rooms and suits section -----------------------------*/}
           <div className="featuredRooms">
           {/*  I have used the repeated design in the promo section hence the headers as shown */}
                <p className="promosHeader ">| Featured rooms</p>
                <h1 className="promoh1Text"><span>Enjoy Memorable Stay </span> from Our Handpicked Rooms <br /> </h1>
                <div className="promoParagraph">
                    <p>Whether you're here for business or leisure, our featured rooms offer the perfect blend of style, comfort, and convenience.
                    </p>
                </div>

               <div className="featuredImagesDiv ">
                    <ImageTextBox
                            className="featuredRoomContainer"
                       
                            >
                               <div className="featuredRoom1 divResize slide_right">  </div>
                    </ImageTextBox>
                    <ImageTextBox
                            className="featuredRoomContainer"
                            >
                               <div className="featuredRoom2 divResize appearOnScroll">  </div>
                    </ImageTextBox>
                    <ImageTextBox
                            btnAction = "submit"
                            >
                               <div className="featuredRoom3 divResize slide_left">  </div>
                    </ImageTextBox>
                </div>
          </div>


      {/* ---------------------- IMAGE GALLERY SECTION ---------------------- */}
      <div className="imageGallerySection">
        <div className="galleryHeader">
          <p className="why_Us">| Our Gallery</p>
          <h1 className="h1Text"><span>Experience</span> Our World Through These Moments</h1>
          <div className="gallerySubtitle">
            <p>Discover the beauty and elegance that awaits you at every corner of our hotel</p>
          </div>
        </div>

        <div className="galleryContainer">
          <div className="galleryRow">
            <div className="galleryItem large">
              <div className="galleryImage galleryImage1"></div>
              <div className="galleryOverlay">
                <h3>Luxury Suites</h3>
                <p>Elegant accommodations with stunning views</p>
              </div>
            </div>
            <div className="galleryItem">
              <div className="galleryImage galleryImage2"></div>
              <div className="galleryOverlay">
                <h3>Fine Dining</h3>
                <p>Exquisite culinary experiences</p>
              </div>
            </div>
          </div>
          
          <div className="galleryRow">
            <div className="galleryItem">
              <div className="galleryImage galleryImage3"></div>
              <div className="galleryOverlay">
                <h3>Pool Area</h3>
                <p>Relaxing oasis under the sun</p>
              </div>
            </div>
            <div className="galleryItem">
              <div className="galleryImage galleryImage4"></div>
              <div className="galleryOverlay">
                <h3>Spa & Wellness</h3>
                <p>Ultimate relaxation and rejuvenation</p>
              </div>
            </div>
            <div className="galleryItem">
              <div className="galleryImage galleryImage5"></div>
              <div className="galleryOverlay">
                <h3>Event Spaces</h3>
                <p>Perfect venues for special occasions</p>
              </div>
            </div>
          </div>

          <div className="galleryRow">
            <div className="galleryItem">
              <div className="galleryImage galleryImage6"></div>
              <div className="galleryOverlay">
                <h3>Lobby</h3>
                <p>Grand entrance with sophisticated design</p>
              </div>
            </div>
            <div className="galleryItem large">
              <div className="galleryImage galleryImage7"></div>
              <div className="galleryOverlay">
                <h3>City Views</h3>
                <p>Breathtaking panoramic scenes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="galleryCta">
          <p>Want to see more of our beautiful spaces?</p>
          <Link to="/gallery" className="btnView">
          {/*   <Button type="submit" btnLabel="View Full Gallery" /> */}
            View Full Gallery
          </Link>
        </div>
      </div>

{/* ...........................This is the Testimonials section................................... */}
<div className="testimonialSection">
         {/*  This is the testimonial box to hold the users says */}
          <div className="clientTestimonials">
                <div className="testimonialsCaption">
                        <p className="why_Us">| Our Testimonials</p>
                        <h1 className="h1Text"><span>Here's</span> what our clients have to say about us.</h1>
                    <div className="homeMessage1 TextDesign testimoniaLights">
                            <p> 
                                Every detail is crafted to ensure comfort and satisfaction. But don't just take our 
                                word for it—hear from our valued guests who have experienced it firsthand.
                            </p>
                    </div>
                </div>
            {    <MessageMover/>}
          </div>

          <div className="comments">
            <Comment/>
          </div>
          <div className="clear"></div>
 </div>
         

 <div className="bodyHr"></div>




{/*.............................. Special offers and promos section .................................*/}
<div className="promoSection">
         <p className="promosHeader">| Special Offers and Promos!</p>
         <h1 className="promoh1Text"><span>Stay in style – </span> unlock exclusive promos for  <br /> <span>unforgettable memories !</span></h1>

         <div className="promoParagraph">
          <p>Your perfect escape awaits! Join us today for amazing offers, top-tier comfort, and an experience you'll cherish forever!</p>
</div>

<div className="promosContainer">
        <PromosCircle 
            discountPercentage ="30%"
            discountTitle = "Family's package"
        />
        <PromosCircle
        discountPercentage ="10%"
        discountTitle = "Hikings"
        />
        <PromosCircle
        discountPercentage ="25%"
        discountTitle = "Meetings & Events"
        />
        <PromosCircle
        discountPercentage ="18%"
        discountTitle = "Couples"
        />
</div>

<div className="promoJoinUs">
      <p>Create an account or sign in today and start your seamless journey towards relaxation__
      <Button type="submit" btnLabel="sign in"/> 
      <ChatButton 
           btnName= "sign up"     
       />
      </p>     
</div>
        
</div>

<div className="bodyHr"></div>

{/*..................... This is the chatBox section where users can send their feedback................ */}
<div className="homeChatSection ">
    <div className="chatCaption ">
      <h2 className=''><span>| Need help?</span> Start a conversation and let us take care of the rest!</h2>

      <p className=''>Our team is here to help with a smile — fast, friendly, and reliable service every time!</p>
    </div>
  
    <Chatform/>   
</div>
         

{/* This is a simple date at the end of our homePage */}
          <div className="captionDate">
              <p>{formatDate(today)}</p>
          </div>
     
      </div>
    </>
  );
}

export default Home;