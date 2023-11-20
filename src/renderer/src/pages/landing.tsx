// project-imports
import Apps from '../sections/landing/Apps';
import Combo from '../sections/landing/Combo';
import ContactUs from '../sections/landing/ContactUs';
import Free from '../sections/landing/Free';
import Hero from '../sections/landing/Header';
import Partner from '../sections/landing/Partner';
import Technologies from '../sections/landing/Technologies';
import Testimonial from '../sections/landing/Testimonial';

// ==============================|| SAMPLE PAGE ||============================== //

const Landing = () => {
  return (
    <>
      <Hero />
      <Technologies />
      <Combo />
      <Apps />
      <Free />
      <Testimonial />
      <Partner />
      <ContactUs />
    </>
  );
};

export default Landing;
