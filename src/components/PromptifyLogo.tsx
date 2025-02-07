import React from 'react'
import { Zap } from 'lucide-react'

const PromptifyLogo = ({
    className = '',
    textClassName = ' text-gray-800 ',
    zapClassName = 'text-blue-500 ',
    zapSize = '32'
}) => {
    return (
        <a href='' className={`flex items-center justify-center gap-0 text-4xl font-bold text-gray-900 ${className}`}>
            <span className={` ${textClassName}`}>P</span>
            <Zap className={`${zapClassName}`} size={{zapSize}} />
            <span className={` ${textClassName}`}>omptify</span>
        </a>
    )
}

export default PromptifyLogo