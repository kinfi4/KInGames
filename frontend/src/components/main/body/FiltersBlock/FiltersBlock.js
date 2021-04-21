import React, {useState} from 'react';
import s from './FiltersBlock.module.css'
import {BsPlusCircleFill, BiSearchAlt} from 'react-icons/all'

import {connect} from "react-redux";
import CategoriesFilterOnHover from "./CategoriesFilterOnHover/CategoriesFilterOnHover";

const FiltersBlock = (props) => {

    const [activeHover, setActiveHover] = useState(false)

    return (
        <div className={s.filterBlock}>
            <div className={s.filterCategory}
                 onMouseEnter={() => setActiveHover(true)}
                 onMouseLeave={() => setActiveHover(false)}>

                <BsPlusCircleFill /> <span> Add Filter </span>
                <CategoriesFilterOnHover active={activeHover} />
            </div>

            <div>
                <div>
                    <BiSearchAlt /> <input type="text" className={s.searchField}/>
                </div>
            </div>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {}
}


export default connect(mapStateToProps)(FiltersBlock);