import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import BASE_URL from "../common/apis/Api";





// expert login
export const loginUserAsync = createAsyncThunk("login/loginUserAsync", async(data) => {

    const res = await axios.post(`${BASE_URL}/auth/login`,{},{}).then((res)=>{

        console.log("success")

        return res


    }).catch((err)=>{

        console.log("failFor",err)

    })

})








const loginSlice = createSlice({
    name: "login",
    initialState: {
        value: {},
        status: "",
        errors: null
    },
    reducers: {
        statusReset(state) {
            state.status = "";
        },
        updateUser: (state, action) => {
            console.log(action);
           
        },
    },


    // loginUser set
    extraReducers:(builder)=> {
        builder
        .addCase(loginUserAsync.pending, (state) => {
            state.status = 'loading';
          })

          .addCase(loginUserAsync.fulfilled, (state, action: any) => {
            if (action.payload.status === 400 || action.payload.status === 500) {
             
              state.status = 'error';
              state.errors = action.payload.data;
            } else {
                console.log("lazim olan bilgiler", action.payload.data);
            }
          })

          .addCase(loginUserAsync.rejected, (state, action) => {
            state.status = 'error';
           
          });
      
       

    }
})


export const { statusReset, updateUser } = loginSlice.actions
export default loginSlice.reducer;


