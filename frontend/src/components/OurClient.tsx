import "./OurClient.css";

interface OurClientProps {
  srcClientImage: string;
}

export default function OurClient({ srcClientImage }: OurClientProps) {
  return (
    <div className="client">
      <img src={srcClientImage} alt="client" />
    </div>
  );
}
