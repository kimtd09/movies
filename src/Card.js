function Card(props) {
    function showModal(e) {
        props.modalRef(props.title, props.original_title, props.year, props.background_img_url);
    }

    return (
        // <div className="card">
        //     <div className="title">{props.movie.original_title}</div>
        //     <div className="card-desc">{props.movie.overview}</div>
        //     <img className="card-img" src={props.imgUrl} alt={props.movie.original_title}></img>
        // </div>

        <div className="card" onClick={showModal}>
            <div className="card-left">
                <img className="card-img" src={props.imgUrl} alt={props.original_title}></img>
            </div>
            <div className="card-right">
                <div className="title">{props.title}</div>
                <div className="original-title">({props.original_title})</div>
                <div className="line">
                    <div className="year">{props.year}</div>
                    <div className="rating">⭐ {props.rating}</div>
                </div>
                <div className="overview">
                    <div>
                        {props.overview}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card