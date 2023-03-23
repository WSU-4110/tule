import banner from "../pics/sky.png";

function Banner(props){
 return(
    <div>
        <div className="container">
                <img className="width-100" src={banner} />
        </div>
    </div>
 );
}

export default Banner;