import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, useGSAP)

CustomEase.create('osmo', '0.625, 0.05, 0, 1')
gsap.defaults({ ease: 'osmo', duration: 0.6 })

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, useGSAP }
