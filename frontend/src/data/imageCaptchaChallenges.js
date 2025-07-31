// Import all images for webpack bundling
import img1 from '../components/captchaTask/0003U.png';
import img2 from '../components/captchaTask/000HU.png';
import img3 from '../components/captchaTask/00179.png';
import img4 from '../components/captchaTask/001r3.png';
import img5 from '../components/captchaTask/002T3.png';
import img6 from '../components/captchaTask/008J2.png';
import img7 from '../components/captchaTask/00b22.png';
import img8 from '../components/captchaTask/00h9K.png';
import img9 from '../components/captchaTask/00M4c.png';
import img10 from '../components/captchaTask/01001.png';
import img11 from '../components/captchaTask/013V2.png';
import img12 from '../components/captchaTask/01685.png';
import img13 from '../components/captchaTask/01E49.png';
import img14 from '../components/captchaTask/01g88.png';
import img15 from '../components/captchaTask/01oe6.png';
import img16 from '../components/captchaTask/01S7y.png';
import img17 from '../components/captchaTask/01tU1.png';
import img18 from '../components/captchaTask/02009.png';
import img19 from '../components/captchaTask/0213K.png';
import img20 from '../components/captchaTask/021p1.png';

// Image-based CAPTCHA challenges
// Each challenge uses an image from the captchaTask directory
// The answer is the filename without the .png extension (case-sensitive)
export const imageCaptchaChallenges = [
  { id: 1, imagePath: '../components/captchaTask/0003U.png', answer: '0003U' },
  { id: 2, imagePath: '../components/captchaTask/000HU.png', answer: '000HU' },
  { id: 3, imagePath: '../components/captchaTask/00179.png', answer: '00179' },
  { id: 4, imagePath: '../components/captchaTask/001r3.png', answer: '001r3' },
  { id: 5, imagePath: '../components/captchaTask/002T3.png', answer: '002T3' },
  { id: 6, imagePath: '../components/captchaTask/008J2.png', answer: '008J2' },
  { id: 7, imagePath: '../components/captchaTask/00b22.png', answer: '00b22' },
  { id: 8, imagePath: '../components/captchaTask/00h9K.png', answer: '00h9K' },
  { id: 9, imagePath: '../components/captchaTask/00M4c.png', answer: '00M4c' },
  { id: 10, imagePath: '../components/captchaTask/01001.png', answer: '01001' },
  { id: 11, imagePath: '../components/captchaTask/013V2.png', answer: '013V2' },
  { id: 12, imagePath: '../components/captchaTask/01685.png', answer: '01685' },
  { id: 13, imagePath: '../components/captchaTask/01E49.png', answer: '01E49' },
  { id: 14, imagePath: '../components/captchaTask/01g88.png', answer: '01g88' },
  { id: 15, imagePath: '../components/captchaTask/01oe6.png', answer: '01oe6' },
  { id: 16, imagePath: '../components/captchaTask/01S7y.png', answer: '01S7y' },
  { id: 17, imagePath: '../components/captchaTask/01tU1.png', answer: '01tU1' },
  { id: 18, imagePath: '../components/captchaTask/02009.png', answer: '02009' },
  { id: 19, imagePath: '../components/captchaTask/0213K.png', answer: '0213K' },
  { id: 20, imagePath: '../components/captchaTask/021p1.png', answer: '021p1' }
];

// Map images to their imported paths
export const captchaImages = {
  '0003U.png': img1,
  '000HU.png': img2,
  '00179.png': img3,
  '001r3.png': img4,
  '002T3.png': img5,
  '008J2.png': img6,
  '00b22.png': img7,
  '00h9K.png': img8,
  '00M4c.png': img9,
  '01001.png': img10,
  '013V2.png': img11,
  '01685.png': img12,
  '01E49.png': img13,
  '01g88.png': img14,
  '01oe6.png': img15,
  '01S7y.png': img16,
  '01tU1.png': img17,
  '02009.png': img18,
  '0213K.png': img19,
  '021p1.png': img20
};

export const imageCaptchaChallengesWithImages = [
  { id: 1, image: img1, answer: '0003U', filename: '0003U.png' },
  { id: 2, image: img2, answer: '000HU', filename: '000HU.png' },
  { id: 3, image: img3, answer: '00179', filename: '00179.png' },
  { id: 4, image: img4, answer: '001r3', filename: '001r3.png' },
  { id: 5, image: img5, answer: '002T3', filename: '002T3.png' },
  { id: 6, image: img6, answer: '008J2', filename: '008J2.png' },
  { id: 7, image: img7, answer: '00b22', filename: '00b22.png' },
  { id: 8, image: img8, answer: '00h9K', filename: '00h9K.png' },
  { id: 9, image: img9, answer: '00M4c', filename: '00M4c.png' },
  { id: 10, image: img10, answer: '01001', filename: '01001.png' },
  { id: 11, image: img11, answer: '013V2', filename: '013V2.png' },
  { id: 12, image: img12, answer: '01685', filename: '01685.png' },
  { id: 13, image: img13, answer: '01E49', filename: '01E49.png' },
  { id: 14, image: img14, answer: '01g88', filename: '01g88.png' },
  { id: 15, image: img15, answer: '01oe6', filename: '01oe6.png' },
  { id: 16, image: img16, answer: '01S7y', filename: '01S7y.png' },
  { id: 17, image: img17, answer: '01tU1', filename: '01tU1.png' },
  { id: 18, image: img18, answer: '02009', filename: '02009.png' },
  { id: 19, image: img19, answer: '0213K', filename: '0213K.png' },
  { id: 20, image: img20, answer: '021p1', filename: '021p1.png' }
];
