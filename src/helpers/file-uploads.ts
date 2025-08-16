"use server"

import supabase from "@/config/supabase-config";
import { success } from "zod"

export const uploadFileAndGetUrl = async (file: File) => {
    try {
        const filename = `${Date.now()}-${file.name}`;
        const uploadResponse = await supabase.storage.from('default').upload(filename, file)

        if (!uploadResponse.data) {
            throw new Error(uploadResponse.error?.message || 'file updload failed')
        }

        const { data } = supabase.storage.from('default').getPublicUrl(filename)

        return {
            success: true,
            message: 'file uploaded successfully',
            data: data.publicUrl
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}