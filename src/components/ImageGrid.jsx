import ImageCard from './ImageCard';

export default function ImageGrid({ images, showActions, onDelete, onPublish }) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No images to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image._id}
          image={image}
          showActions={showActions}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
