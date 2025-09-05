interface Props {
  vote: Vote;
}

const VoteBubble: React.FC<Props> = ({ vote }) => {
  return (
    <div className='w-10 h-10 rounded-full bg-linear-120 from-primary-400 to-primary-600 text-white text-xl font-bold grid place-items-center'>
      {vote.index + 1}
    </div>
  );
};

export default VoteBubble;
