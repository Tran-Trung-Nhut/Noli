import Viewer from 'react-viewer';

const ImageViewer = ({
    images,
    onClose,
    activeIndex
}: {
    images: string[];
    onClose: () => void;
    activeIndex: number
}) => {
    return (
        <Viewer
            visible={images.length > 0}
            onClose={onClose}
            images={images.map(src => ({ src }))}
            zIndex={100}
            activeIndex={activeIndex}
            
        />
    );
}

export default ImageViewer