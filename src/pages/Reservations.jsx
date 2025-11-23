import React, { useState, useEffect } from "react";
import "../styles/Reservation.css";
import TextBox from "../components/TextBox";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import PayPopUp from "../components/popUps/PayPopUp";
import BookImgDesign from "../components/BookImgDesign";
import Modal from "../components/popUps/Modal";
import MpesaPaymentForm from "./MpesaPaymentForm";

const Reservations = () => {
  /* create an array of tabs to help in navigation */
  const tabs = ["DELUXE", "FAMILY", "CONFERENCE", "SPA", "GYM"];

  const [activeTab, setActiveTab] = useState("DELUXE");

  //Setting up our payment popUp
  const [showModal, setShowModal] = useState(false);

  //An array of buttons to open the right popUp for each room
  const btns = [
    "dx1",
    "dx2",
    "dx3",
    "dx4",
    "fm1",
    "fm2",
    "fm3",
    "fm4",
    "cf1",
    "cf2",
    "cf3",
    "cf4",
    "sp1",
    "sp2",
    "sp3",
    "sp4",
    "gm1",
    "gm2",
    "gm3",
    "gm4",
  ];
  const [activeBtn, setActiveBtn] = useState("");

  //Booking page animation
  /* fuction to rotate the image items */
  const rotateItems = () => {
    setItems((prevItems) => {
      const firstItem = prevItems[0]; // Get the first item
      return [...prevItems.slice(1), firstItem]; // Move the first item to the end
    });
  };
  //useEffect to track all changes
  useEffect(() => {
    const interval = setInterval(rotateItems, 8000); // Rotate every 8 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  //declaring an array of items
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Events Solution",
      description:
        "Focus on your business objectives while we handle all the logistics.",
      className: "imageDiv1",
    },
    {
      id: 2,
      name: "Family rooms",
      description:
        "Thoughtfully designed rooms to ensure a comfortable and memorable family vacation.",
      className: "imageDiv2",
    },
    {
      id: 3,
      name: "SPA Retreats",
      description: "Surrender to the healing touch of our skilled therapists",
      className: "imageDiv3",
    },
    {
      id: 4,
      name: "Deluxe Rooms",
      description:
        "Step into serenity and sophistication with our Sanctuary Deluxe Rooms",
      className: "imageDiv4",
    },
    {
      id: 5,
      name: "Honeymoon Suites",
      description:
        "Indulge in the epitome of romance at our exquisite Honeymoon Suite",
      className: "imageDiv5",
    },
    {
      id: 6,
      name: "Gym Solutions",
      description:
        "Modern gym with modern equipments to help you flex and refresh",
      className: "imageDiv6",
    },
    {
      id: 7,
      name: "Events Solution",
      description:
        "Focus on your business objectives while we handle all the logistics.",
      className: "imageDiv7",
    },
  ]);

  return (
    <>
      {/*......................... Reserve room SECTION 1....................... */}
      <div className="reserveSection1 scrollSnap">
        {/* IMAGE SLIDER */}
        <div className="section1ImageSlider">
          <div className="slide">
            {items.map((item) => (
              <div key={item.id} className={`${item.className} sliderItem`}>
                <div className="content">
                  <div className="booking_name">| {item.name}</div>
                  <div className="booking_Des">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAPTION PARAGRAPH */}
        <div className="Section1TextCaption">
          <h1>
            | Enjoy seemless bookings! create,
            <span>
              {" "}
              unforgettable <br />
              &nbsp; memories.{" "}
            </span>
          </h1>

          <TextBox className="contactMessage1 TextDesign">
            <p>
              Whether you have questions, special requests, or need help
              planning your stay, our dedicated team is just a call or email
              away. Reach out to us anytime—day or—night. Focus on your business
              objectives while we handle all the logistics.
            </p>
          </TextBox>
        </div>
      </div>

      {/*......................... Reserve room SECTION 2....................... */}
      <div className="reserveSection2">
        {/*   SECTION 2 PART 1 */}
        <h3>
          <span>| Seamless booking,</span> it's never been this Quick!
        </h3>

        <div className="selectRoomBar">
          <SearchBar />
          <ul className="tabs">
            {tabs.map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 2 PART II  */}

        <div className="roomsHolderMover">
          {/* Content */}
          <div className="tab-content">
            {/* 1. Deluxe Rooms Container */}
            {activeTab === "DELUXE" && (
              <div className="roomImagesContainer">
                <div className="bookImgContainer duluxe2">
                  <BookImgDesign className="imageDiv4" Tab={activeTab}>
                    <h4>Garden View</h4>
                    <ul>
                      <li>Plush king-size bed with premium linens</li>
                      <li>Private balcony overlooking garden</li>
                      <li>43' smart-TV with streaming services</li>
                      <li>Spacious marble en-suite bathroom</li>
                      <li>Mini-bar and coffee station</li>
                      <li>24-hour concierge service</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[0]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("dx1");
                      }}
                      btnLabel="Book Now"
                    />

                    {activeBtn === "dx1" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="200"
                          title="Garden View"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer duluxe1">
                  <BookImgDesign className="imageDiv3">
                    <h4>City View</h4>
                    <ul>
                      <li>Luxury queen-size bed</li>
                      <li>Floor-to-ceiling city view windows</li>
                      <li>43' smart-TV with cable channels</li>
                      <li>Ergonomic work desk with charging ports</li>
                      <li>Rain shower en-suite bathroom</li>
                      <li>Complimentary high-speed Wi-Fi</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[1]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("dx2");
                      }}
                      btnLabel="Book Now"
                    />

                    {activeBtn === "dx2" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="150"
                          title="City View"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer duluxe3">
                  <BookImgDesign className="imageDiv6">
                    <h4>Balcony Gaze</h4>
                    <ul>
                      <li>Super king-size canopy bed</li>
                      <li>Private furnished balcony</li>
                      <li>55' ultra HD smart-TV</li>
                      <li>Separate seating area</li>
                      <li>Luxury bathroom with Jacuzzi</li>
                      <li>Personalized room service</li>
                    </ul>
                    <Button
                      type="submit"
                      key={btns[2]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("dx3");
                      }}
                      btnLabel="Book Now"
                    />

                    {activeBtn === "dx3" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="450"
                          title="Balcony Gaze"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer duluxe4">
                  <BookImgDesign className="imageDiv5">
                    <h4>Mountain View</h4>
                    <ul>
                      <li>Premium king-size bed</li>
                      <li>Panoramic mountain views</li>
                      <li>43' smart-TV with movie library</li>
                      <li>Cozy fireplace and seating area</li>
                      <li>Spa-like bathroom with steam shower</li>
                      <li>Complimentary breakfast included</li>
                    </ul>
                    <Button
                      type="submit"
                      key={btns[3]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("dx4");
                      }}
                      btnLabel="Book Now"
                    />

                    {activeBtn === "dx4" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="300"
                          title="Mountain View"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>
              </div>
            )}

            {/* 2. FAMILY Rooms Container */}
            {activeTab === "FAMILY" && (
              <div className="roomImagesContainer">
                <div className="bookImgContainer family1">
                  <BookImgDesign className="imageDiv8">
                    <h4>Family Suite Small</h4>
                    <ul>
                      <li>One king bed + one single bed</li>
                      <li>Separate children's play area</li>
                      <li>Smart TV with kids channels</li>
                      <li>Child-safe amenities available</li>
                      <li>Family-sized bathroom</li>
                      <li>Baby cot on request</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[4]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("fm1");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "fm1" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="500"
                          title="Family Suite Small"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer family2">
                  <BookImgDesign className="imageDiv9">
                    <h4>Family Suite Large</h4>
                    <ul>
                      <li>Two queen beds + bunk beds</li>
                      <li>Separate living and dining area</li>
                      <li>Multiple smart TVs</li>
                      <li>Full kitchenette with microwave</li>
                      <li>Two bathrooms</li>
                      <li>Board games and entertainment</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[5]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("fm2");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "fm2" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="800"
                          title="Family Suite Large"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer family3">
                  <BookImgDesign className="imageDiv10">
                    <h4>Family Connecting Rooms</h4>
                    <ul>
                      <li>Two connecting deluxe rooms</li>
                      <li>Parent's room + children's room</li>
                      <li>Shared living space</li>
                      <li>Double smart TV setup</li>
                      <li>Separate bathrooms</li>
                      <li>Extra storage for family luggage</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[6]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("fm3");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "fm3" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="600"
                          title="Family Connecting Rooms"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer family4">
                  <BookImgDesign className="imageDiv11">
                    <h4>Family Premium Suite</h4>
                    <ul>
                      <li>Master suite + children's bedroom</li>
                      <li>Private kitchen and dining area</li>
                      <li>Entertainment system with gaming</li>
                      <li>Baby changing station</li>
                      <li>Jacuzzi and separate shower</li>
                      <li>Complimentary family activities</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[7]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("fm4");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "fm4" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="1000"
                          title="Family Premium Suite"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>
              </div>
            )}

            {/* 3. CONFERENCE Rooms Container */}
            {activeTab === "CONFERENCE" && (
              <div className="roomImagesContainer">
                <div className="bookImgContainer conference1">
                  <BookImgDesign className="imageDiv12">
                    <h4>Medium Conference Hall</h4>
                    <ul>
                      <li>Capacity: 50-80 people</li>
                      <li>HD projector and large screen</li>
                      <li>Wireless microphones</li>
                      <li>High-speed dedicated Wi-Fi</li>
                      <li>Catering kitchen access</li>
                      <li>Professional sound system</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[8]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("cf1");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "cf1" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="1000"
                          title="Medium Conference Hall"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer conference2">
                  <BookImgDesign className="imageDiv13">
                    <h4>Grand Ballroom</h4>
                    <ul>
                      <li>Capacity: 200-300 people</li>
                      <li>Multiple projection screens</li>
                      <li>Stage and lighting system</li>
                      <li>Dedicated event coordinator</li>
                      <li>Full catering facilities</li>
                      <li>Professional photography setup</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[9]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("cf2");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "cf2" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="4000"
                          title="Grand Ballroom"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer conference3">
                  <BookImgDesign className="imageDiv14">
                    <h4>Executive Boardroom</h4>
                    <ul>
                      <li>Capacity: 10-20 executives</li>
                      <li>Smart interactive whiteboard</li>
                      <li>Video conferencing facilities</li>
                      <li>Leather executive chairs</li>
                      <li>Built-in sound system</li>
                      <li>Private butler service</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[10]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("cf3");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "cf3" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="900"
                          title="Executive Boardroom"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer conference4">
                  <BookImgDesign className="imageDiv15">
                    <h4>Outdoor Pavilion</h4>
                    <ul>
                      <li>Capacity: 100-150 people</li>
                      <li>Covered outdoor venue</li>
                      <li>Natural lighting and garden views</li>
                      <li>Weather-proof audio system</li>
                      <li>Barbecue and outdoor catering</li>
                      <li>Flexible seating arrangements</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[11]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("cf4");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "cf4" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="900"
                          title="Outdoor Pavilion"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>
              </div>
            )}

            {/* 4. SPA SERVICES Container */}
            {activeTab === "SPA" && (
              <div className="roomImagesContainer">
                <div className="bookImgContainer spa1">
                  <BookImgDesign className="imageDiv16">
                    <h4>Full Body Massage</h4>
                    <ul>
                      <li>90-minute deep tissue massage</li>
                      <li>Aromatherapy essential oils</li>
                      <li>Hot stone therapy included</li>
                      <li>Professional certified therapists</li>
                      <li>Private treatment room</li>
                      <li>Post-massage herbal tea</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[12]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("sp1");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "sp1" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="1000"
                          title="Full Body Massage"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer spa2">
                  <BookImgDesign className="imageDiv17">
                    <h4>Premium Facial Care</h4>
                    <ul>
                      <li>Luxury facial treatment</li>
                      <li>Skin analysis and consultation</li>
                      <li>Organic skincare products</li>
                      <li>Anti-aging and hydration</li>
                      <li>Neck and shoulder massage</li>
                      <li>Take-home skincare samples</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[13]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("sp2");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "sp2" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="2000"
                          title="Premium Facial Care"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer spa3">
                  <BookImgDesign className="imageDiv18">
                    <h4>Manicure & Pedicure</h4>
                    <ul>
                      <li>Luxury hand and foot treatment</li>
                      <li>Gel polish application</li>
                      <li>Exfoliating scrub and massage</li>
                      <li>Custom nail art available</li>
                      <li>Sanitized equipment</li>
                      <li>Nail health consultation</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[14]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("sp3");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "sp3" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="2500"
                          title="Manicure & Pedicure"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer spa4">
                  <BookImgDesign className="imageDiv19">
                    <h4>Body Piercing </h4>
                    <ul>
                      <li>Professional piercing service</li>
                      <li>Various jewelry options available</li>
                      <li>Aftercare guidance provided</li>
                      <li>Hygiene-focused environment</li>
                      <li>Expert consultation included</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[15]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("sp4");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "sp4" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="3000"
                          title="Body Piercing Service"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>
              </div>
            )}

            {/* 5. GYM SERVICES Container */}
            {activeTab === "GYM" && (
              <div className="roomImagesContainer">
                <div className="bookImgContainer gym1">
                  <BookImgDesign className="imageDiv20">
                    <h4>Gym Access</h4>
                    <ul>
                      <li>Unlimited gym equipment</li>
                      <li>Steam room and sauna </li>
                      <li>Professional trainer </li>
                      <li>Complimentary towels and water</li>
                      <li>Nutrition guidance session</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[16]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("gm1");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "gm1" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="2000"
                          title="Full Day Gym Access"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer gym2">
                  <BookImgDesign className="imageDiv21">
                    <h4>Personal Training</h4>
                    <ul>
                      <li>One-on-one personal training</li>
                      <li>Customized workout plan</li>
                      <li>Fitness assessment </li>
                      <li>Technique guidance</li>
                      <li>Flexible scheduling </li>
                      <li>Progress tracking support</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[17]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("gm2");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "gm2" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="1000"
                          title="Personal Training Session"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer gym3">
                  <BookImgDesign className="imageDiv22">
                    <h4>Hourly Gym Pass</h4>
                    <ul>
                      <li>One-hour gym access</li>
                      <li>Full equipment usage</li>
                      <li>Changing room access</li>
                      <li>Complimentary water bottle</li>
                      <li>Basic instructor assistance</li>
                      <li>Quick workout flexibility</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[18]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("gm3");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "gm3" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="500"
                          title="Hourly Gym Pass"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>

                <div className="bookImgContainer gym4">
                  <BookImgDesign className="imageDiv23">
                    <h4>Swimming Pool</h4>
                    <ul>
                      <li>Swimming gear available</li>
                      <li>Lifeguard supervision</li>
                      <li>Changing rooms </li>
                      <li>Swimming lessons </li>
                      <li>Perfect for recreation and fitness</li>
                    </ul>

                    <Button
                      type="submit"
                      key={btns[19]}
                      onClick={() => {
                        setShowModal(true);
                        setActiveBtn("gm4");
                      }}
                      btnLabel="Book Now"
                    />
                    {activeBtn === "gm4" && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <PayPopUp
                          Amount="800"
                          title="Swimming Pool Access"
                          onClose={() => setShowModal(false)}
                        />
                      </Modal>
                    )}
                  </BookImgDesign>
                </div>
              </div>
            )}

            {/*-----------  END OF ALL ROOMS , IMAGES AND DETAILS----------------  */}
          </div>
        </div>
      </div>

      {/* MPESA PAYMENT OPTION */}
      <div className="reserveSection3">
        <h2 className="slide_right">
          | Payment <span>Options</span>
        </h2>
        <div className="reservationGuidlinesp">
          <p>___You are free to PAY NOW or pay on Arrival___</p>
        </div>
      </div>
      <MpesaPaymentForm />

      {/*......................... Reserve room SECTION 3....................... */}
      <div className="reserveSection3">
        <h2 className="slide_right">
          | Our Booking <span>Guidlines</span>
        </h2>
        <div className="reservationGuidlines">
          <ul>
            <li>Make sure to have your original ID/PASSPORT</li>
            <li>Strictly No weapons allowed</li>
            <li>No drugs allowed</li>
            <li>Observe CHECK-IN and CHECK-OUT</li>
            <li>Chlidren to be accampanied by their gurdians at all times</li>
          </ul>
        </div>
        <div className="reservationGuidlinesp">
          <p>
            We are looking forwad to your value stay at SmatyGrand.{" "}
            <span>Feel at home!</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Reservations;
