import styled from "@material-ui/core/styles/styled";
import Typography from "./article/Typography";
import React, {useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {alpha, IconButton} from "@material-ui/core";
import {MdThumbUp} from "react-icons/md";
import {css} from "@emotion/react";
import {animated, useSpring} from "react-spring";
import {observer} from "mobx-react-lite";
import {useScroll} from "@use-gesture/react";
import {window} from "../utils/common";
import {headerStore} from "../stores";


const StyledPaper = styled(animated(Paper))(({theme}) => css`
  position: absolute;
  right: 0;
  color: ${alpha(theme.palette.text.primary, 0.6)};

  &:hover {
    color: ${theme.palette.text.primary}
  }
`)


const Chip = styled('span')``

const VoteIcon: React.FC = () => <MdThumbUp size={20}/>

const UpVoteBtn = styled(IconButton)(({theme}) => css`
  &[aria-checked='true'] {
    color: ${theme.palette.primary.main};
  }
`)

const DnVoteBtn = styled(UpVoteBtn)`
  transform: rotate(180deg);
`

const Vote: React.FC = observer(() => {
    const paperRef = useRef<HTMLDivElement>(null);
    const [adsorbed, setAdsorbed] = useState(false);
    const toRight = 50
    const toTop = (headerStore.appear ? headerStore.height : 0) + 20

    const {x, y} = useSpring({
        immediate: true,
        from: {x: 0, y: 0},
    })

    useScroll(({xy: [, curY]}) => {
        if (curY > 0) {
            if (!x.isAnimating && !adsorbed) {
                const paperRect = paperRef.current?.getBoundingClientRect() || {x: 0, y: 0, width: 0, height: 0}
                y.start(toTop - paperRect.y + paperRect.height)
                x.start(window.innerWidth - paperRect.x - paperRect.width - toRight)
                    .then((r) => {
                        if (r.finished) setAdsorbed(true)
                    })
            }
            // stop immediately to reduce wrong animation
            if ((x.isAnimating || y.isAnimating) && curY > 100) {
                x.stop()
                y.stop()
                setAdsorbed(true)
            }
        } else if (curY === 0 && adsorbed) {
            setAdsorbed(false)
            x.start(0)
            y.start(0)
        }
    }, {
        target: window
    })

    return (
        <StyledPaper
            ref={paperRef}
            elevation={adsorbed ? 2 : 0}
            style={
                adsorbed ? {} : {x, y}}
            sx={
                adsorbed ? {
                    position: "fixed",
                    right: toRight,
                    top: toTop,
                    transition: 'top 300ms',
                    padding: '2px 6px 0'
                } : {
                    position: "absolute",
                    bottom: "1.2rem"
                }
            }

        >
            <Chip>本篇的质量？</Chip>
            <UpVoteBtn title={'好'} aria-label={'好'}><VoteIcon/></UpVoteBtn>
            <DnVoteBtn title={'差'} aria-label={'差'}><VoteIcon/></DnVoteBtn>
        </StyledPaper>
    )
})


const StyledH1 = styled(Typography.h1)`
  margin-top: 2.5rem;
  flex-grow: 1;
`

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  position: relative;
`

const Title: React.FC = (props) => {
    const {children} = props
    return (
        <StyledBox>
            <StyledH1>{children}</StyledH1>
            <Vote/>
        </StyledBox>
    )
}

export default Title