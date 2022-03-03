import { useState } from "react";
import { useForm } from 'react-hook-form';
import Button from './Button'

export default function Form({ defaultValues, children, onSubmit }) {
    const { handleSubmit, register, formState: { errors }, setValue } = useForm({ defaultValues, reValidateMode: 'onSubmit', });

    const [ inputs , ...rest] = children;

    return (
        <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 mb-8">

        {Array.isArray(inputs)
          ? inputs.map((child) => {
              const CustomInput = child?.type
              return child?.props?.id
              ? (<CustomInput register={register} setValue={setValue} key={child.props.id} validError={errors[child.props.id]} {...child.props} />)
              : (child);
            })
            : children
        }
        </div>

        {rest}

      </form>
        </>
    );
  }

  export function ButtonGroup({ register, id, label, ...rest }) {
      const [groupValue, setGroupValue] = useState('');

      const changeGroupValue = (e) => {
          e.preventDefault();
          rest.setValue(id, e.target.innerHTML)
          setGroupValue(e.target.innerHTML)
      }


      return (
          <div className={rest?.className || ''}>
              <div className="mt-3 d-flex align-items-baseline">
                  {label}: {groupValue}
                  <p className="ms-auto mb-0" style={{fontSize: '10px', lineHeight: 1.1, color: 'red'}}>
                  {rest.errors ? rest.errors.message : ''}
                  </p>
              </div>
              <select {...register(id, rest?.validate)} className="d-none" value={groupValue}/>
              {/* <select {...register(id)}> */}
                  {rest.options.map((value, index) => (
                      <Button onClick={(e) => changeGroupValue(e)} key={value}>{value}</Button>
                      // <option key={value} value={rest.users[index]}>{value}</option>
                  ))}
              {/* </select> */}
          </div>
      );
    }

  export function Select({ register, id, label, ...rest }) {
      rest.setValue(id, rest.users[0])
      return (
          <div className={rest?.className || ''}>
              <div className="mt-3 d-flex align-items-baseline">
                  {label}
                  <p className="ms-auto mb-0" style={{fontSize: '10px', lineHeight: 1.1, color: 'red'}}>
                  {rest.errors ? rest.errors.message : ''}
                  </p>
              </div>
              <select {...register(id)} >
                  {rest.options.map((value, index) => (
                      <option key={value + index} value={rest.users[index]}>{value}</option>
                  ))}
              </select>
          </div>
      );
    }

export function Input({ register, id, validError, ...rest }) {
    return (
        <>
            <p className="mt-4 text-xs leading-none text-danger">
                {validError ? validError.message : '\xa0'}
            </p>
            <input
            type={rest.type || 'text'}
            placeholder={id.charAt(0).toUpperCase() + id.slice(1)}
            defaultValue={rest.value}
            className={"w-full text-2xl border-b-2 outline-none rounded-none focus:border-black autofill:bg-none " + rest?.classList}
            {...register(id.replace("'", ''), rest?.validate)}
            />
        </>
    )
}
export function OptionsInput({ register, id, validError, ...rest }) {
    return (
        <>
            <p className="mt-4 text-xs leading-none text-danger">
                {validError ? validError.message : '\xa0'}
            </p>
            <div className="flex align-middle w-full">
                <input
                type={rest.type || 'text'}
                defaultValue={rest.value}
                placeholder={id}
                className={"w-full text-2xl border-b-2 outline-none rounded-none focus:border-black autofill:bg-none " + rest?.classList}
                {...register(id.replace("'", ''), rest?.validate)}
                />
                <Button onClick={() => rest.removeOption(rest.index)} classList="bg-danger rounded-full d-flex items-center p-2" padding={true}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16.67" height="16.67" viewBox="0 0 16.67 16.67"><line x1="2" y1="14.67" x2="14.67" y2="2" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2" y1="2" x2="14.67" y2="14.67" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                </Button>
            </div>
        </>
    )
}

export function PassInput({ register, id, validError, ...rest }) {
    const [inputText, toggleText] = useState(false);
    return (
        <>
            <p className="mt-4 text-xs leading-none text-danger">
                {validError ? validError.message : '\xa0'}
            </p>
            <div className="flex align-middle w-full relative">
                <input
                type={inputText ? 'text' : 'password'}
                defaultValue={rest.value}
                placeholder={id.charAt(0).toUpperCase() + id.slice(1)}
                className={"w-full text-2xl pr-10 border-b-2 outline-none rounded-none focus:border-black autofill:bg-none " + rest?.classList}
                {...register(id.replace("'", ''), rest?.validate)}
                />

                {/* <Button  classList="bg-transparent d-flex items-center p-2" padding={true}> */}
                <svg className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => toggleText(!inputText)} xmlns="http://www.w3.org/2000/svg" width="25" height="15" viewBox="0 0 25 15">
                    <ellipse cx="12.5" cy="7.5" rx="12" ry="7" fill="#c5d3ff" stroke="#000" strokeMiterlimit="10"/>
                    {inputText && <circle cx="12.5" cy="7.5" r="3" fill="#07378f"/>}
                </svg>
                {/* </Button> */}
            </div>
        </>
    )
}
export function TextArea({ register, id, label, validError, ...rest }) {
    const autoSize = (el) => {
        el.style.height = "3rem";
        el.style.height = (el.scrollHeight)+"px";
    }
    return (
        <>
            <p className="mt-4 text-xs leading-none text-danger">
                {validError ? validError.message : '\xa0'}
            </p>
            <textarea
            defaultValue={id}
            onInput={(e) => {autoSize(e.target)}}
            placeholder={id.charAt(0).toUpperCase() + id.slice(1)}
            className={"min-h-12 h-12 overflow-hidden w-full border-b-2 outline-none rounded-none focus:border-black autofill:bg-none " + rest.classList}
            {...register('Poll Question', rest?.validate)}
            />
        </>
    )
}

  export function CheckBox({ register, id, label, ...rest }) {
    return (
        <label className="mt-3">
        <input type="checkbox" {...register(id, rest.validate)} />
        &nbsp;{label}</label>
    );
  }