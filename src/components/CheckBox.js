import React from 'react'

export const CheckBox = props => {
    return (
            <input key={props.name} onChange={props.handleCheckChildElement} type="checkbox" checked={props.isChecked} value={props.name} />
    )
}

export default CheckBox