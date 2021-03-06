import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Icon from '@material-ui/core/Icon';
import { Link } from "react-router-dom";
import Routes from '../../router/routes';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Grid from '@material-ui/core/Grid';
import { isLoggedIn } from '../../utility'
import { withRouter } from 'react-router';
import Badge from '@material-ui/core/Badge';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    userInfo: {
        margin: theme.spacing(1),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

function MainPage({ actions, history, shop, userInfo }) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const numberOfProductsInBasket = shop.basket.products.length;

    useEffect(() => {
        async function getProducts() {
            try {
                if (isLoggedIn() && (!userInfo.name.first || !userInfo.name.last)) {
                    await actions.getUserInfo();
                }
            } catch (err) {
                alert(err.message);
            }
        }

        getProducts();

    }, [actions, userInfo])

    async function handleSignOut() {
        try {
            await actions.logOutUser();
            await actions.removeUserInfo();
            history.push('/');
        } catch (err) {
            alert(err.message);
        }
    }

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <Grid container direction="row" alignItems="center" justify="space-between">
                        <Grid item xs={4}>
                            <Grid container alignItems="center" justify="flex-start">
                                <Grid item xs={2}>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        className={clsx(classes.menuButton, {
                                            [classes.hide]: open,
                                        })}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h6" noWrap>
                                        Shop Manager
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container alignItems="center" justify="flex-end">
                                <Grid item className={classes.userInfo}>
                                    {isLoggedIn()
                                        ?
                                        <Typography variant="subtitle1" noWrap>
                                            {`${userInfo.name.first} ${userInfo.name.last}`}
                                        </Typography>
                                        :
                                        ''
                                    }
                                </Grid>
                                <Grid item>
                                    {isLoggedIn()
                                        ?
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            className={classes.button}
                                            onClick={handleSignOut}>
                                            Log out
                                            </Button>
                                        :
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            className={classes.button}
                                            component={Link}
                                            to='/signin'>
                                            Log in
                                        </Button>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
                open={open}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key={'Products'} component={Link} to="/products">
                        <ListItemIcon>
                            <Icon className={classes.margin}>home</Icon>
                        </ListItemIcon>
                        <ListItemText primary={'Products'} />
                    </ListItem>
                    <ListItem button key={'Basket'} component={Link} to="/ticket">
                        <ListItemIcon>
                            <Badge color="secondary" badgeContent={numberOfProductsInBasket} invisible={!numberOfProductsInBasket} className={classes.margin}>
                                <Icon>shopping_cart</Icon>
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={'Basket'} />
                    </ListItem>
                    <ListItem button key={'Home'} component={Link} to="/home">
                        <ListItemIcon>
                            <InboxIcon className={classes.margin} />
                        </ListItemIcon>
                        <ListItemText primary={'Home'} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {
                        isLoggedIn() ?
                            <ListItem button key={'Profile'} component={Link} to="/profile">
                                <ListItemIcon>
                                    <Icon className={classes.margin}>face</Icon>
                                </ListItemIcon>
                                <ListItemText primary={'Profile'} />
                            </ListItem>
                            : ''
                    }
                    <ListItem button key={'About'} component={Link} to="/about">
                        <ListItemIcon>
                            <Icon className={classes.margin}>info</Icon>
                        </ListItemIcon>
                        <ListItemText primary={'About'} />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Routes />
            </main>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

const mapStateToProps = (state) => ({ ...state });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainPage));
