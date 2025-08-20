"use server"

import supabase from "@/config/supabase-config"
import { IUser } from "@/interfaces"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken" 
import { cookies } from "next/headers"
import { success } from "zod"

export const registerUser = async (payload: Partial<IUser>) => {
    // check apakah user email sudah ada
    const { data: existingUser, error: existingUserError} = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", payload.email);
    
    if (existingUserError) {
        return {
            success: false,
            message: existingUserError.message
        }
    }
    
    if (existingUser && existingUser.length > 0) {
        return {
            success: false,
            message: "user already exists with this email"
        }
    }

    // hash password
    payload.password = await bcrypt.hash(payload.password!,  10)
    
    // insert data user
    const { error, data } = await supabase
        .from("user_profiles")
        .insert([payload]);

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "user registered successfully"
    }
}

export const loginUser = async (payload: Partial<IUser>) => {
    // check apakah user sudah terdaftar
    const { data: existingUser, error: existingUserError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", payload.email);

    if (existingUserError || !existingUser || existingUser.length === 0) {
        return {
            success: false,
            message: existingUserError?.message || 'user not found'
        }
    }

    const user = existingUser?.[0];

    // mencocokkan password
    const isPasswordValid = await bcrypt.compare(
        payload.password!,
        user?.password || ""
    );

    if (!isPasswordValid) {
        return {
            success: false,
            message: 'invalid email or password'
        }
    }

    // mengembalikan data user
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
    });

    return {
        success: true,
        message: 'user logged in successfully',
        data: jwtToken,
        user: user
    }
}

export const getLoggedInUser = async () => {
    try {
        const cookesStore = await cookies();
        const jwtToken = cookesStore.get('jwt_token')?.value;
        const decodedData: any = jwt.verify(
            jwtToken || '',
            process.env.JWT_SECRET!
        );
        const userId = decodedData.userId;

        const { data: users, error } = await supabase.from('user_profiles').select("*").eq('id', userId)

        if (users?.length === 0 || error) {
            return {
                success: false,
                message: "user not found"
            }
        }

        const user = users[0];
        delete user.password;
        return {
            success: true,
            message: 'user data fetched successfully',
            data: user
        }

        
    } catch (error) {
        return {
            success: false,
            message: "error fetching user data"
        }
    }
}

export const getAllUsers = async () => {
    const { data, error } = await supabase.from('user_profiles').select('*')

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: 'user fetched successfully',
        data: data
    }
}