

export const CircleButton = ({classList, ...rest}) => {
    return (
        <Button classList={'rounded-full d-flex items-center p-4 ' + classList} padding={true} {...rest}/>
    )
}


const Button = ({classList, onClick, label, ...rest} ) => {
    classList += !rest.padding ? ' px-4 py-2 rounded' : ''
    return (
        <button
        className={'btn border border-black font-grotesk shadow-dark hover:shadow-dark-hover ' + classList }
        onClick={(e) => onClick ? onClick(e) : e}
        type={rest?.type}
        >
            {label || rest?.children || 'Button'}
        </button>
    )
}


export default Button;