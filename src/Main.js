import { useEffect, useState } from "react";
import { api_url, api_getconfig, api_request, lowQualityImg, highQualityImg } from "./api/themoviedb"
import Card from "./Card";
import movie from "./assets/svg/movie.svg"
import tv from "./assets/svg/tv.svg"
import chevron_left from "./assets/svg/chevron_left.svg"
import chevron_right from "./assets/svg/chevron_right.svg"
import double_arrow_left from "./assets/svg/double_arrow_left.svg"
import double_arrow_right from "./assets/svg/double_arrow_right.svg"
import gotop from "./assets/svg/north.svg"
import close from "./assets/svg/close.svg"
import supported_languages from "./api/selected_lang"

import flag_usa from "./assets/svg/flags/us.svg"
import flag_uk from "./assets/svg/flags/gb-eng.svg"
import flag_fr from "./assets/svg/flags/fr.svg"
import flag_es from "./assets/svg/flags/es.svg"
import flag_it from "./assets/svg/flags/it.svg"
import flag_de from "./assets/svg/flags/de.svg"
import flag_jp from "./assets/svg/flags/jp.svg"
import flag_kr from "./assets/svg/flags/kr.svg"
import flag_cn from "./assets/svg/flags/cn.svg"
import flag_ru from "./assets/svg/flags/ru.svg"


function Main() {

    const flagMap = new Map()
    flagMap.set('en-US', flag_usa)
    flagMap.set('en-GB', flag_uk)
    flagMap.set('fr-FR', flag_fr)
    flagMap.set('es-ES', flag_es)
    flagMap.set('it-IT', flag_it)
    flagMap.set('de-DE', flag_de)
    flagMap.set('ja-JP', flag_jp)
    flagMap.set('ko-KR', flag_kr)
    flagMap.set('zh-CN', flag_cn)
    flagMap.set('ru-RU', flag_ru)

    // States
    const [requestUrl, setRequestUrl] = useState(api_url)
    const [imgUrl, setImgUrl] = useState("")
    const [errorMessage, setErrorMessage] = useState("test")
    const [httpStatus, setHttpStatus] = useState(true) // true = ok, false = not ok
    const [data, setData] = useState(null)
    const [isMovie, setIsMovie] = useState(true)
    const [selectedNavItem, setSelectedNavItem] = useState("") // the position of the selected navbar
    const [page, setPage] = useState(1)
    const [category,setCategory] = useState("")
    const [showGoToTop, setShowGoToTop] = useState(false)
    const [language, setLanguage] = useState("en-US")
    const [flag, setFlag] = useState(flag_usa)
    const [isDebugOn, setIsDebugOn] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const modalItem = useState({ title: "", original_title: "", year: "", img: "" })[0];

    // SVG
    const _movie = <img className="" src={movie} alt="movieSVG"></img>
    const _tv = <img className="" src={tv} alt="TVSVG"></img>

    function changeCategory(e) {
        setCategory(e.target.dataset.keyword)
        setSelectedNavItem(e.target.dataset.select)
        e.target.dataset.tv === "yes" ? setIsMovie(false) : setIsMovie(true)
        setPage(1)
    }

    function imageUrlBuilder(path, quality) {
        return quality === true ?
            imgUrl + highQualityImg + path :
            imgUrl + lowQualityImg + path
    }

    function changePage(e) {
        const i = page + Number(e.target.dataset.increment);

        if (i <= 0) {
            setPage(1);
        }
        else {
            setPage(i);
        }
    }

    function changeLanguage(e) {
        setLanguage(e.target.value)
        console.log(flagMap)
        console.log(flagMap.get(e.target.value))
        setFlag(flagMap.get(e.target.value))
    }

    function goToTop(e) {
        document.documentElement.scrollTo(0, 0);
    }

    function toggleDebug() {
        setIsDebugOn(!isDebugOn)
        console.log(isDebugOn)
    }

    useEffect(() => {
        window.addEventListener("scroll", scrollCheck);
    },[])

    function scrollCheck(e) {
        const _currentScroll = document.documentElement.scrollTop;
        // console.log(_currentScroll);
        setShowGoToTop( () => _currentScroll > 600 ? true : false );
    }

    /**
     * the callback function when we open the modal by clicking a card
     */
    function modalRef(title, original_title, year, url) {
        setShowModal(!showModal)
        modalItem.title = title
        modalItem.original_title = original_title
        modalItem.year = year
        modalItem.img = url
    }

    function closeModal() {
        setShowModal(!showModal)
    }

    useEffect(() => {
        api_getconfig()
        .then(data => {
            setErrorMessage("HTTP OK")
            setHttpStatus(true)
            setImgUrl(data)
        })
        .catch(error => {
            const msg = "ERROR " + error.status + ": " + error.data.status_message
            setErrorMessage(msg)
            console.error(msg)
            setHttpStatus(false)
        })
    },[])

    useEffect(() => {
        api_request(requestUrl)
        .then(data => {
            setErrorMessage("HTTP OK")
            setHttpStatus(true)
            if(data.data === "") {
                console.log("no data to parse")
            }
            else if (data.data.results != null){
                console.log("parsing " + data.data.results.length + " results")
                setData(data.data.results)
            }
        })
        .catch(error => {
            console.error(error)
            const msg = "ERROR " + error.status + ": " + error.data.status_message
            setErrorMessage(msg)
            console.error(msg)
            setHttpStatus(false)
        })
    },[requestUrl])

    useEffect(() => {
        setRequestUrl(api_url + category + "?language=" + language + "&page=" + page)
    }, [category, page, language])
    
    return (
        <div className="main-container">
            <div className="navbar">
                <ul>
                    {_movie}
                    <li onClick={changeCategory} data-keyword="/movie/top_rated" data-select="1" className={selectedNavItem === '1' ? "selected" : ""}>Top movies</li>
                    <li onClick={changeCategory} data-keyword="/movie/popular" data-select="2" className={selectedNavItem === '2' ? "selected" : ""}>Popular Movies</li>
                    <li onClick={changeCategory} data-keyword="/trending/movie/day" data-select="3" className={selectedNavItem === '3' ? "selected" : ""}>Trending Movies</li>

                    {_tv}
                    <li onClick={changeCategory} data-keyword="/trending/tv/day" data-tv="yes" data-select="4" className={selectedNavItem === '4' ? "selected" : ""}>Trending TV shows</li>
                </ul>
            </div>

            {errorMessageBox()}
            {toolBar()}
            {goTop()}
            {modal()}

            <div className="main-cards-container">

                <div className="cards-container">
                {
                    data === null ? "" :
                        data.map(element => {
                            const title = isMovie ? element.title : element.name
                            const original_title = isMovie ? element.original_title : element.original_name
                            const date = isMovie ? new Date(element.release_date) : new Date(element.first_air_date)
                            const year = date.getFullYear()
                            const rating = element.vote_average
                            const overview = element.overview
                            const url = imageUrlBuilder(element.poster_path, false)
                            const background_img_url = imageUrlBuilder(element.backdrop_path, true)

                            // console.log(element)
                            return <Card title={title} original_title={original_title} year={year} rating={rating} imgUrl={url} overview={overview} background_img_url={background_img_url} modal={modalItem} modalRef={modalRef}/>
                        })
                }
                </div>
            </div>

            {pageNavigation()}
        </div>
    )

    function toolBar() {
        return <div className="toolbar">
            <div className="debug"><button className={isDebugOn? "on" : ""}  onClick={toggleDebug}>debug</button></div>
            {pageNavigation()}
            <div className="flagselector">
                <img className="flag" src={flag} alt="fr"></img>
                <select>
                    {
                        supported_languages.map( item => {
                            return <option value={item.code} onClick={changeLanguage}>{item.lang}</option>
                        })
                    }
                </select>
            </div>
        </div>
    }

    function pageNavigation() {
        return <div className="nav-pages">
            <img src={double_arrow_left} alt="-10pages" className="allocine-nav-pages-chevron" onClick={changePage} data-increment="-10"></img>
            <img src={chevron_left} alt="-1page" className="allocine-nav-pages-chevron" onClick={changePage} data-increment="-1"></img>
            <span>{page}</span>
            <img src={chevron_right} alt="+1page" className="allocine-nav-pages-chevron" onClick={changePage} data-increment="1"></img>
            <img src={double_arrow_right} alt="+10pages" className="allocine-nav-pages-chevron" onClick={changePage} data-increment="10"></img>
        </div>
    }

    function goTop() {
        return <div className="gotop" style={{display: showGoToTop ? "flex" : "none" }}  onClick={goToTop}>
                <img src={gotop} alt="go to top"></img>
            </div>
    }

    function errorMessageBox() {
        return <div className={isDebugOn ? "" : "hidden"}><div className={httpStatus === false ? "errorbox errorbox-error" : "errorbox errorbox-ok"}>{errorMessage}</div></div>
    }

    function modal() {
        return <div className={showModal === false ? "hidden" : "modal"}>
            <div className="container">
                <div className="header">
                    <img className="close" src={close} alt="close" onClick={closeModal}></img>
                </div>
                <img className="img" src={modalItem.img} alt={modalItem.title}></img>
                <div className="footer">
                    <span>{modalItem.title}</span>
                    <span>{modalItem.original_title}</span>
                    <span>{modalItem.year}</span>
                </div>
            </div>

            
        </div>
    }

}

export default Main;