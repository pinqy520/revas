import * as React from 'react'

interface ViewProperties {

}

export default function View(props: ViewProperties & any) {
  return React.createElement('View', props)
}