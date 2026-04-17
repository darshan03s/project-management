import { AppError } from '@/lib/errors'
import { NextResponse } from 'next/server'

export function withErrorHandler<T extends (...args: any[]) => any>(fn: T) {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      if (error instanceof AppError) {
        console.log(error)
        return NextResponse.json(
          { error: error.message, code: error.customCode, success: false },
          { status: error.statusCode }
        )
      }

      return NextResponse.json(
        { error: 'Unknown Error', code: 'UNKNOWN_ERROR', success: false },
        { status: 500 }
      )
    }
  }
}
