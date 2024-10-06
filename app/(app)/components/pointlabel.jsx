import Flag from 'react-world-flags';

const PointLabel = async (props) => {
    const response = await (await fetch(`/parameters/${props.country}`)).json();
  return (
    <div className="w-56 h-fit bg-woodsmoke-200 text-woodsmoke-900 px-2 py-1 rounded-lg">
        <div className='flex flex-row justify-between'>
            <Flag code={props.country.toUpperCase()} className="w-5 h-5" />
            <p className='text-xl font-cabinet text-woodsmoke-900'>{props.country.toUpperCase()} </p>
        </div>
        <div id="parametersContainer">
            
        </div>
    </div>
  )
}

export default PointLabel