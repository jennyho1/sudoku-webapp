interface Props {
  onNumberClick: (number: number) => void;
}

function Numpad({ onNumberClick }: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="numpad">
      {numbers.map((number) => (
        <button
          key={number}
          className="numpad-button"
          onClick={() => onNumberClick(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
}

export default Numpad;
