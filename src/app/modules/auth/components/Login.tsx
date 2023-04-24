/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth} from '../core/Auth'
import {formRequirement } from "../../../../service/util/formRequirement"





const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email doğru giriniz')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required("E-posta gereklidir"),

  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required("şifre gereklidir"),

})


const initialValues = {
  email: 'expert@graf.com.tr',
  password: 'abd123',

}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {


  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()



  //submit the login form

  // function login_Expert(e: any){
  //   console.log("dataFrom", e)
  // }




  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {

        const {data: auth} = await login(values.email, values.password)
        saveAuth(auth)
        const {data: user} = await getUserByToken(auth.api_token)
        setCurrentUser(user)




        // login_Expert(values)


      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('Giriş bilgileri yanlış')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })







  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>Giriş Yap</h1>

        {/* <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div> */}

      </div>
      {/* begin::Heading */}

      {/* begin::Login options */}
      <div className='row g-3 mb-9'>
      
      </div>

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div>

        </div>
        // <div className='mb-10 bg-light-info p-8 rounded'>
        //   <div className='text-info'>
        //     Use account <strong>admin@demo.com</strong> and password <strong>demo</strong> to
        //     continue.
        //   </div>
        // </div>
      )}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>E-posta</label>
        <input
          placeholder='E-posta'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>

        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Şifreniz</label>

        <input
          type='password'
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
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>

          Şifremi Unuttum
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >

          {!loading && <span className='indicator-label'>Giriş Yap</span>}

          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Lütfen Bekleyin...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Hesabın yok mu?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Hemen Kaydol
        </Link>
      </div>
    </form>
  )
}
