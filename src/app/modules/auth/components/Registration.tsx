/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, MouseEventHandler } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { getUserByToken, register } from '../core/_requests'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { PasswordMeterComponent } from '../../../../_metronic/assets/ts/components'
import { useAuth } from '../core/Auth'

// react select title inside
import Select, {components,MultiValueGenericProps,MultiValueProps,OnChangeValue,Props, } from 'react-select'
import {SortableContainer,SortableContainerProps,SortableElement,SortEndHandler,SortableHandle,} from 'react-sortable-hoc';
import { ColourOption, colourOptions } from '../../../../service/util/data';





function arrayMove<T>(array: readonly T[], from: number, to: number) {

  const slicedArray = array.slice();

  slicedArray.splice(
    to < 0 ? array.length + to : to,
    0,
    slicedArray.splice(from, 1)[0]
  );
  return slicedArray;
}




const SortableMultiValue = SortableElement(
  (props: MultiValueProps<ColourOption>) => {

    // this prevents the menu from being opened/closed when the user clicks
    // on a value to begin dragging it. ideally, detecting a click (instead of
    // a drag) would still focus the control and toggle the menu, but that
    // requires some magic with refs that are out of scope for this example



    const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const innerProps = { ...props.innerProps, onMouseDown };
    return <components.MultiValue {...props} innerProps={innerProps} />;
  }
);
const SortableMultiValueLabel = SortableHandle(
  (props: MultiValueGenericProps) => <components.MultiValueLabel {...props} />
);


const SortableSelect = SortableContainer(Select) as React.ComponentClass<
  Props<ColourOption, true> & SortableContainerProps

>;








const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
}





const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Adınız gerekli'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('E-posta gerekli'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Soyadınız gerekli'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Şifre gereklidir'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Şifre gereklidir')
    .oneOf([Yup.ref('password')], "Şifreler eşleşmiyor"),
  acceptTerms: Yup.bool().required('Kullanım sözleşmesi Kabul etmeniz lazım'),
})



export function Registration() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data: auth } = await register(
          values.email,
          values.firstname,
          values.lastname,
          values.password,
          values.changepassword
        )
        saveAuth(auth)
        const { data: user } = await getUserByToken(auth.api_token)
        setCurrentUser(user)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('Kayıt Bilgileri yanlış.')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  //choose branch from heer
  const [selected, setSelected] = React.useState< readonly ColourOption[]>([
    colourOptions[4],
    colourOptions[5],
  ]);

  const onChange = (selectedOptions: OnChangeValue< ColourOption, true>) =>
  setSelected(selectedOptions);

const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
  const newValue = arrayMove(selected, oldIndex, newIndex);
  setSelected(newValue);
  console.log(
    'Values sorted:',
    newValue.map((i) => i.value)
  );
};



  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Üye Ol</h1>
        {/* end::Title */}

        {/* <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div> */}
      </div>
      {/* end::Heading */}

      {/* begin::Login options */}
      <div className='row g-3 mb-9'>
        {/* begin::Col */}

        {/* end::Col */}

        {/* begin::Col */}

        {/* end::Col */}
      </div>
      {/* end::Login options */}

      {/* <div className='separator separator-content my-14'>
        <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
      </div> */}

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>Ad</label>
        <input
          placeholder='Adınız'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('firstname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.firstname && formik.errors.firstname,
            },
            {
              'is-valid': formik.touched.firstname && !formik.errors.firstname,
            }
          )}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.firstname}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}
      <div className='fv-row mb-8'>
        {/* begin::Form group Lastname */}
        <label className='form-label fw-bolder text-dark fs-6'>Soyad</label>
        <input
          placeholder='Soyadınız'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('lastname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.lastname && formik.errors.lastname,
            },
            {
              'is-valid': formik.touched.lastname && !formik.errors.lastname,
            }
          )}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.lastname}</span>
            </div>
          </div>
        )}
        {/* end::Form group */}
      </div>

      {/* chhose your  branch from here */}
      <div className='fv-row mb-8'>
        {/* begin::Form group Lastname */}
        
        <label className='form-label fw-bolder text-dark fs-6'>Branş</label>


        <SortableSelect
      useDragHandle
      // react-sortable-hoc props:
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions={({ node }) => node.getBoundingClientRect()}
      // react-select props:
      isMulti
      options={colourOptions}
      value={selected}
      onChange={onChange}
      components={{
        // @ts-ignore We're failing to provide a required index prop to SortableElement
        MultiValue: SortableMultiValue,        


      }}
      closeMenuOnSelect={false}
    />




        {/* end::Form group */}
      </div>



      {/* begin::Form group Email */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>E-posta</label>
        <input
          placeholder='E-posta'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-dark fs-6'>Şifre</label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Password'
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Şifre </label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>

            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <span>
            Kullanım Sözlşemesi{' '}
            <a
              href='https://keenthemes.com/metronic/?page=faq'
              target='_blank'
              className='ms-1 link-primary'
            >
              Kabul ediyorum
            </a>
            .
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.acceptTerms}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Üye Ol</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Lütfen Bekleyin...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            Giriş Yap
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}
