import React from 'react';
import s from './FiltersBlock.module.css'
import {BsPlusCircleFill, BiSearchAlt} from 'react-icons/all'

import {connect} from "react-redux";

const FiltersBlock = (props) => {
    return (
        <div className={s.filterBlock}>
            <div> <BsPlusCircleFill /> <span> Add Filter </span></div>

            <div>
                <div className={s.outterSearch}>
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