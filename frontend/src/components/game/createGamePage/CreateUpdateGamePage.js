import React, {useEffect, useState} from 'react';
import s from './CreateGamePage.module.css'
import detailsPage from '../detailGamePage/GameDetailsPage.module.css'
import {connect} from "react-redux";
import {BASE_URL} from "../../../config";
import {fetchListCategories} from "../../../redux/reducers/categoriesListReducer";
import {addGame, fetchGame, updateGame} from "../../../redux/reducers/gameListReducer";
import {showMessage} from "../../../utils/messages";
import {NavLink} from "react-router-dom";

const CreateUpdateGamePage = (props) => {
    const initialState = {
        title: '',
        price: 0,
        description: '',
        imageOnLoad: null,
        categories: [],
        previewImage: `${BASE_URL}media/games_previews/default.png`
    }

    useEffect(() => {
        props.fetchListCategories()
        if(props.isUpdate){
            let urlBlocks = window.location.href.split('/')
            let gameSlug = urlBlocks[urlBlocks.length - 1]
            props.fetchGame(gameSlug)
        }
    }, [])



    return (
        (!props.isUpdate || props.game) && <CreateUpdateGamePageChild initialState={initialState} game={props.game} {...props} />
    );
}

const CreateUpdateGamePageChild = (props) => {
    let initialState = props.initialState
    const inputTextRef = React.createRef()

    useEffect(() => {
        if(inputTextRef.current && props.isUpdate)
            inputTextRef.current.textContent = props.game.description
    }, [])

    if(props.isUpdate){
        initialState = {
            title: props.game.title,
            price: props.game.price,
            description: props.game.description,
            imageOnLoad: null,
            categories: props.game.categories.map(el => el.slug),
            previewImage: `${BASE_URL}${props.game.preview_image.slice(1)}`
        }
    }

    const [details, setDetails] = useState(initialState)

    let onLoadImage = (file) => {
        let reader = new FileReader()
        reader.onload = (ev) => {
            if(reader.readyState === 2){
                setDetails({...details, previewImage: reader.result, imageOnLoad: file})
            }
        }
        try{
            reader.readAsDataURL(file)
        }catch (e){}
    }
    let onSave = () => {
        if(props.isUpdate){
            props.updateGame(props.game.slug, details.title, details.price, details.description, 1000, details.categories, details.imageOnLoad)
        }else{
            props.addGame(details.title, details.price, details.description, 1000, details.categories, details.imageOnLoad)
            setDetails(props.initialState)
        }

        showMessage([{message: 'Saved', type: 'success'}])
    }

    return (
        <div className={s.addGameBlock}>
            <div className={s.addDataBlock}>
                <div>
                    <input type="file" className={s.previewImage} id={'preview_image'}
                           onInput={event => onLoadImage(event.target.files[0])} accept={'image/*'}/>
                    <label htmlFor={'preview_image'} className={s.previewImageLabel}
                           style={{backgroundImage: `url(${details.previewImage})`,
                               backgroundColor: '#1c1c1c',
                               backgroundRepeat: 'no-repeat',
                               backgroundPositionX: 'center',
                               backgroundPositionY: 'center',
                               backgroundSize: 'contain'}}>

                        Select preview image
                    </label>

                    <NavLink to={'/'}><div className={detailsPage.buyButton} onClick={onSave}>SAVE</div></NavLink>
                </div>

                <div className={s.inputTextBlock}>
                    <input type="text" className={s.inputLine} placeholder={'Title'}
                           onInput={(e) => setDetails({...details, title: e.target.value})}
                           value={details.title}/>

                    <input type="number" className={`${s.inputLine} ${s.shortInput}`} placeholder={'Price'} id={'price'}
                           onInput={(e) => setDetails({...details, price: e.target.value})}
                           value={details.price}/>

                    <div className={s.descriptionInput}>
                        <div className={s.descriptionInputInner} contentEditable={true}
                             onInput={e => setDetails({...details, description: e.target.textContent})}
                             data-placeholder={'Description'}
                             ref={inputTextRef}>
                        </div>
                    </div>

                    <div className={s.gameCategoriesWrapper}>
                        <div>Chose genres</div>
                        <div className={s.genres}>
                            {props.categories.map((el, i) => {
                                let manageCategoryAdd = () => {
                                    if(details.categories.includes(el.slug)){
                                        let newCategories = details.categories.filter(s => s !== el.slug)
                                        setDetails({...details, categories: newCategories})
                                    }
                                    else {
                                        setDetails({...details, categories: [...details.categories, el.slug]})
                                    }
                                }

                                let chosenClass = ''
                                if(details.categories.includes(el.slug))
                                    chosenClass = s.chosen

                                return (
                                    <div key={i} className={`${s.categoryButton} ${chosenClass}`}
                                         onClick={manageCategoryAdd}>
                                        {el.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}


let mapStateToProps = (state) => {
    return {
        categories: state.categories.categories,
        game: state.listGames.activeGame
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        fetchListCategories: () => dispatch(fetchListCategories),
        addGame: (title, price, description, numberOfLicence, categories, preview) =>
            dispatch(addGame(title, price, description, numberOfLicence, categories, preview)),
        fetchGame: (slug) => dispatch(fetchGame(slug)),
        updateGame: (slug, title, price, description, numberOfLicence, categories, preview) =>
            dispatch(updateGame(slug, title, price, description, numberOfLicence, categories, preview)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUpdateGamePage);