import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
  WhatsappIcon,
} from "react-share";

const ShareButtons = ({ property }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;
  return (
   <>
   <h3 className="text-xl font-bold text-center pt-2">
    Share This Property:
   </h3>
   .flex.gap-3.justify-content.pb-5
   </>
  );
};

export default ShareButtons;
