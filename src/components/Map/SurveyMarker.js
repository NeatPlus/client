const pinStyle = {
    cursor: 'pointer',
    stroke: 'none',
};

const SurveyMarker = ({title}) => {
    return (
        <svg 
            width="50" 
            height="50" 
            viewBox="0 0 50 50" 
            style={{...pinStyle, transform: 'translate(-25px,-25px)'}}
        >
            <g>
                {!!title && <title>{title}</title>}
                <ellipse strokeWidth="0" opacity="0.48" ry="25" rx="25" id="svg_2" cy="25" cx="25" stroke="#000" fill="#00a297"/>
                <ellipse ry="18" rx="18" id="svg_4" cy="25" cx="25" strokeWidth="0" stroke="#000" fill="#00a297"/>
            </g>
        </svg>
    );
};

export default SurveyMarker;
