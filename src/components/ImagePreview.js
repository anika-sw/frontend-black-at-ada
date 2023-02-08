import '../ImagePreview.css';

const ImagePreview = (props) => {
  const { src, alt } = props;
  const objectUrl = URL.createObjectURL(src);

  return (
    <div>
      <img src={objectUrl} alt={alt} />
    </div>
  )
};

export default ImagePreview;