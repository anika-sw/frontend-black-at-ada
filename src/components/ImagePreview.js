import PropTypes from "prop-types";
import '../styles/ImagePreview.css';

const ImagePreview = (props) => {
  if (!(props.src instanceof File)) {
    return (
      <div>
        <img className="img-thumbnail" src={props.src} alt={props.alt} />
      </div>
    )
  } else {
    const objectUrl = URL.createObjectURL(props.src);
    return (
      <div>
        <img className="img-thumbnail" src={objectUrl} alt={props.alt} />
      </div>
    )
  }
};

ImagePreview.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  alt: PropTypes.string
};

export default ImagePreview;